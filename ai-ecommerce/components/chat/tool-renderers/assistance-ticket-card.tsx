'use client';

import { TicketIcon, CheckCircle2Icon, ClockIcon } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  return: 'Devolución',
  warranty: 'Garantía',
  delivery: 'Envío',
  defect: 'Defecto',
  setup: 'Configuración',
  other: 'Otro',
};

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-slate-500/20 text-slate-600',
  medium: 'bg-amber-500/20 text-amber-700',
  high: 'bg-rose-500/20 text-rose-700',
};

interface AssistanceTicketCardProps {
  ticketId: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

export function AssistanceTicketCard({
  ticketId,
  category,
  subject,
  description,
  priority,
  status,
  createdAt,
}: AssistanceTicketCardProps) {
  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const priorityStyle = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium;
  const date = new Date(createdAt).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <TicketIcon className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Ticket de asistencia creado
          </p>
          <p className="mt-0.5 font-mono text-sm font-bold text-foreground">
            {ticketId}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-700">
          <CheckCircle2Icon className="size-3" aria-hidden="true" />
          Abierto
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Asunto</p>
          <p className="font-medium text-foreground">{subject}</p>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {categoryLabel}
        </span>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${priorityStyle}`}
        >
          {priority}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <ClockIcon className="size-3" aria-hidden="true" />
          {date}
        </span>
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground">
        Nuestro equipo revisará tu ticket en las próximas 24–48 horas.
      </p>
    </div>
  );
}
