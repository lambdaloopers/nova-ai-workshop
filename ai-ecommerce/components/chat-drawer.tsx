"use client";

import {
  MessageSquareIcon,
  PanelRightCloseIcon,
  SparklesIcon,
  HistoryIcon,
  PlusIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatPanel } from "@/components/chat/chat-panel";
import { ThreadHistory } from "@/components/chat/thread-history";
import {
  PANEL_MAX_WIDTH,
  PANEL_MIN_WIDTH,
  useChatDrawer,
} from "@/lib/chat-drawer-context";
import { useAgent } from "@/lib/agent-context";
import { useThread } from "@/lib/thread-context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

/**
 * Resizable side-panel shell. Knows nothing about chat logic —
 * all message handling lives in ChatPanel and its children.
 */
export function ChatDrawer() {
  const { open, width, setOpen, setWidth } = useChatDrawer();
  const { agentId } = useAgent();
  const { createThread, activeThreadId } = useThread();
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, setOpen]);

  // ── Resize drag logic ──
  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(true);
      const startX = e.clientX;
      const startWidth = width;

      const onMove = (ev: PointerEvent) => {
        const delta = startX - ev.clientX;
        const next = Math.min(
          PANEL_MAX_WIDTH,
          Math.max(PANEL_MIN_WIDTH, startWidth + delta),
        );
        setWidth(next);
      };

      const onUp = () => {
        setDragging(false);
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [width, setWidth],
  );

  return (
    <>
      {/* ── Floating trigger — always visible when panel is closed ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chat"
        className={cn(
          "fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg",
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          "hover:scale-105 hover:shadow-xl",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open
            ? "pointer-events-none scale-90 opacity-0"
            : "scale-100 opacity-100",
        )}
      >
        <MessageSquareIcon className="size-5" aria-hidden="true" />
      </button>

      {/* ── Side panel ── */}
      <aside
        ref={panelRef}
        role="complementary"
        aria-label="AI Chat assistant"
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex flex-col border-l bg-card",
          !dragging &&
            "transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ width, overscrollBehavior: "contain" }}
      >
        {/* ── Resize handle ── */}
        <div
          onPointerDown={onDragStart}
          className={cn(
            "absolute inset-y-0 -left-1 z-10 w-2 cursor-col-resize",
            "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:bg-transparent before:transition-colors before:duration-200",
            "hover:before:bg-primary/40",
            dragging && "before:bg-primary/40",
          )}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat panel"
          aria-valuenow={width}
          aria-valuemin={PANEL_MIN_WIDTH}
          aria-valuemax={PANEL_MAX_WIDTH}
          tabIndex={0}
          onKeyDown={(e) => {
            const step = 20;
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setWidth(Math.min(PANEL_MAX_WIDTH, width + step));
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              setWidth(Math.max(PANEL_MIN_WIDTH, width - step));
            }
          }}
        />

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b px-4 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <SparklesIcon
                className="size-4 text-primary"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-none truncate">
                Nova Assistant
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                Ask about any product
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {user && (
              <>
                <button
                  type="button"
                  onClick={() => createThread()}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="New conversation"
                >
                  <PlusIcon className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                    showHistory
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-label="Toggle history"
                >
                  <HistoryIcon className="size-4" aria-hidden="true" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close chat"
            >
              <PanelRightCloseIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Panel de historial ── */}
        {showHistory && (
          <div className="border-b bg-muted/30 max-h-64 overflow-y-auto">
            <ThreadHistory />
          </div>
        )}

        {/* ── Chat logic (messages + input) ── */}
        <ChatPanel key={activeThreadId || agentId} />
      </aside>

      {/* Block text selection while resizing */}
      {dragging && (
        <div
          className="fixed inset-0 z-50 cursor-col-resize"
          aria-hidden="true"
        />
      )}
    </>
  );
}
