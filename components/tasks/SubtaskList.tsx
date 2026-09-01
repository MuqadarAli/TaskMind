"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Subtask } from "@/store/useTaskStore";

export function SubtaskList({
  subtasks,
  onToggle,
  onDelete,
}: {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
  onDelete?: (subtaskId: string) => void;
}) {
  if (subtasks.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <AnimatePresence initial={false}>
        {subtasks.map((subtask) => (
          <motion.div
            key={subtask.id}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="flex items-center gap-2 rounded-xl bg-zinc-950/[0.03] px-3 py-2 dark:bg-white/[0.06]"
          >
            <button
              type="button"
              aria-label={`Mark ${subtask.title} ${subtask.completed ? "open" : "complete"}`}
              onClick={() => onToggle(subtask.id)}
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                subtask.completed
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-zinc-300 bg-white dark:border-white/20 dark:bg-white/10",
              )}
            >
              {subtask.completed ? <Check className="h-3 w-3" /> : null}
            </button>
            <span
              className={cn(
                "min-w-0 flex-1 text-sm text-zinc-700 dark:text-zinc-300",
                subtask.completed && "text-zinc-400 line-through dark:text-zinc-500",
              )}
            >
              {subtask.title}
            </span>
            {onDelete ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                aria-label={`Delete ${subtask.title}`}
                onClick={() => onDelete(subtask.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
