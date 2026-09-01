"use client";

import { AnimatePresence, Reorder } from "framer-motion";
import { Inbox } from "lucide-react";
import { TaskItem } from "@/components/tasks/TaskItem";
import type { Task } from "@/store/useTaskStore";

export function TaskList({
  title,
  description,
  tasks,
  onComplete,
  onDelete,
  onOpen,
  onReorder,
  onToggleSubtask,
}: {
  title: string;
  description: string;
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onOpen: (task: Task) => void;
  onReorder: (tasks: Task[]) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
          {tasks.length}
        </span>
      </div>

      {tasks.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={onReorder}
          className="space-y-3"
        >
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => onComplete(task.id)}
                onDelete={() => onDelete(task.id)}
                onOpen={() => onOpen(task)}
                onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      ) : (
        <div className="flex min-h-28 items-center gap-3 rounded-2xl border border-dashed border-zinc-200 bg-white/50 px-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
          <Inbox className="h-4 w-4" />
          Nothing here right now.
        </div>
      )}
    </section>
  );
}
