"use client";

import { format, isPast, isToday, parseISO } from "date-fns";
import { motion, Reorder, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronRight,
  GripVertical,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SubtaskList } from "@/components/tasks/SubtaskList";
import { cn } from "@/lib/utils";
import type { Task } from "@/store/useTaskStore";

export function TaskItem({
  task,
  onComplete,
  onDelete,
  onOpen,
  onToggleSubtask,
}: {
  task: Task;
  onComplete: () => void;
  onDelete: () => void;
  onOpen: () => void;
  onToggleSubtask: (subtaskId: string) => void;
}) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = useReducedMotion();
  const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !task.completed;

  const completeTask = () => {
    if (task.completed || reduceMotion) {
      onComplete();
      return;
    }

    setIsCompleting(true);
    window.setTimeout(onComplete, 520);
  };

  const deleteTask = () => {
    if (reduceMotion) {
      onDelete();
      return;
    }

    setIsDeleting(true);
    window.setTimeout(onDelete, 260);
  };

  return (
    <Reorder.Item
      value={task}
      dragListener={!task.completed}
      className="list-none"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{
        opacity: isDeleting ? 0 : 1,
        y: 0,
        x: isDeleting ? 18 : 0,
        scale: isCompleting ? 0.98 : 1,
        height: isDeleting || isCompleting ? 0 : "auto",
        marginBottom: isDeleting || isCompleting ? 0 : undefined,
      }}
      exit={{ opacity: 0, height: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      whileDrag={{ scale: 1.01, zIndex: 10 }}
    >
      <motion.article
        layout
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.18, right: 0.03 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -90) deleteTask();
        }}
        className={cn(
          "group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm shadow-zinc-950/5 backdrop-blur transition dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/10",
          task.completed && "opacity-70",
          isCompleting && "border-indigo-300 bg-indigo-50/80 dark:border-indigo-300/30 dark:bg-indigo-400/10",
        )}
      >
        <div className="flex gap-3">
          <button
            type="button"
            onClick={completeTask}
            aria-label={`Mark ${task.title} ${task.completed ? "open" : "complete"}`}
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
              task.completed || isCompleting
                ? "border-indigo-500 bg-indigo-500 text-white"
                : "border-zinc-300 bg-white hover:border-indigo-400 dark:border-white/20 dark:bg-white/10",
            )}
          >
            <motion.span
              initial={false}
              animate={{ pathLength: task.completed || isCompleting ? 1 : 0 }}
              className="flex"
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          </button>

          <div className="min-w-0 flex-1">
            <button type="button" onClick={onOpen} className="block w-full text-left">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <motion.h3
                    layout
                    className={cn(
                      "break-words text-sm font-semibold leading-6 text-zinc-950 dark:text-white",
                      (task.completed || isCompleting) &&
                        "text-zinc-400 line-through dark:text-zinc-500",
                    )}
                  >
                    {task.title}
                  </motion.h3>
                  {task.description ? (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      {task.description}
                    </p>
                  ) : null}
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5" />
              </div>
            </button>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={task.priority}>{task.priority}</Badge>
              {dueDate ? (
                <Badge tone={isOverdue ? "high" : "neutral"}>
                  <CalendarDays className="mr-1 h-3 w-3" />
                  {isToday(dueDate) ? "Today" : format(dueDate, "MMM d")}
                </Badge>
              ) : null}
              {task.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>

            <SubtaskList subtasks={task.subtasks} onToggle={onToggleSubtask} />
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1">
            <GripVertical className="mt-1 h-4 w-4 text-zinc-300 dark:text-zinc-600" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-zinc-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label={`Delete ${task.title}`}
              onClick={deleteTask}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.article>
    </Reorder.Item>
  );
}
