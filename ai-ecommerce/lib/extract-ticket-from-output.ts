/**
 * Extracts ticket data from subagent or tool output.
 * Prefers structured data; falls back to parsing NVA-XXX from text when needed
 * (subagent output often doesn't expose tool results in the stream).
 */

const TICKET_ID_REGEX = /NVA-[A-Z0-9]{6,10}/i;

const CATEGORY_KEYWORDS: Record<string, RegExp[]> = {
  delivery: [/entrega|pedido|envío|shipping|delivery|llegado|llegar/i],
  return: [/devolución|devolver|return|refund|reembolso/i],
  warranty: [/garantía|warranty|reparación|repair/i],
  defect: [/defecto|defective|no funciona|broken|estropeado/i],
  setup: [/configuración|setup|instalar|install/i],
};

const CATEGORY_LABELS: Record<string, string> = {
  delivery: 'Problema con entrega',
  return: 'Solicitud de devolución',
  warranty: 'Reclamación de garantía',
  defect: 'Producto defectuoso',
  setup: 'Ayuda con configuración',
  other: 'Solicitud de asistencia',
};

export interface TicketData {
  ticketId: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

function isTicketData(obj: unknown): obj is TicketData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as TicketData).ticketId === 'string'
  );
}

function inferCategoryFromText(text: string): string {
  for (const [category, patterns] of Object.entries(CATEGORY_KEYWORDS)) {
    if (patterns.some((p) => p.test(text))) return category;
  }
  return 'other';
}

/** Extract ticket from plain text (for when only text part exists, no tool part). */
export function extractTicketFromText(text: string): TicketData | null {
  const match = text.match(TICKET_ID_REGEX);
  if (!match) return null;
  const ticketId = match[0].toUpperCase();
  const category = inferCategoryFromText(text);
  return {
    ticketId,
    category,
    subject: CATEGORY_LABELS[category] ?? 'Solicitud de asistencia',
    description:
      'Ticket creado desde el chat. El equipo de soporte revisará tu solicitud en las próximas 24–48 horas.',
    priority: 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Extracts ticket data from various output shapes.
 * When parsing from text (fallback), uses clean subject/description, not agent prose.
 */
export function extractTicketFromOutput(output: unknown): TicketData | null {
  if (output === undefined || output === null) return null;

  // Output can be a string (agent response text)
  if (typeof output === 'string') {
    const match = output.match(TICKET_ID_REGEX);
    if (!match) return null;
    const ticketId = match[0].toUpperCase();
    const category = inferCategoryFromText(output);
    return {
      ticketId,
      category,
      subject: CATEGORY_LABELS[category] ?? 'Solicitud de asistencia',
      description:
        'Ticket creado desde el chat. El equipo de soporte revisará tu solicitud en las próximas 24–48 horas.',
      priority: 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
  }

  if (typeof output !== 'object') return null;
  const out = output as Record<string, unknown>;

  // Direct ticket (from createAssistanceTicket tool)
  if (isTicketData(out)) return out;

  // Nested in output.output
  if (out.output && isTicketData(out.output)) return out.output as TicketData;

  // In steps (subagent called createAssistanceTicket)
  const steps = out.steps as
    | Array<{ toolName?: string; name?: string; result?: unknown }>
    | undefined;
  if (Array.isArray(steps)) {
    const ticketStep = steps.find((s) => {
      const name = (s.toolName ?? s.name ?? '').toString();
      const isTicketTool =
        name === 'createAssistanceTicket' || name === 'create-assistance-ticket';
      return isTicketTool && s.result && isTicketData(s.result);
    });
    if (ticketStep?.result) return ticketStep.result as TicketData;
  }

  // Fallback: parse NVA-XXX from text (subagent output often lacks structured tool result)
  // Use clean labels, NOT the agent's response text
  let text = (out.text ?? out.result ?? out.content ?? '') as string;
  if (typeof text !== 'string') {
    // Handle content as array of parts (e.g. [{ type: 'text', text: '...' }])
    const content = out.content;
    if (Array.isArray(content)) {
      text = content
        .filter((p: { type?: string; text?: string }) => p.type === 'text' && p.text)
        .map((p: { text: string }) => p.text)
        .join(' ');
    } else {
      return null;
    }
  }

  const match = text.match(TICKET_ID_REGEX);
  if (!match) return null;

  const ticketId = match[0].toUpperCase();
  const category = inferCategoryFromText(text);
  const subject = CATEGORY_LABELS[category] ?? 'Solicitud de asistencia';

  return {
    ticketId,
    category,
    subject,
    description: 'Ticket creado desde el chat. El equipo de soporte revisará tu solicitud en las próximas 24–48 horas.',
    priority: 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
  };
}
