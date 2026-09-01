"use client";

import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SubtaskList } from "@/components/tasks/SubtaskList";
import type { Priority, Task } from "@/store/useTaskStore";

export function TaskDetailModal({
  task,
  onClose,
  onSave,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: {
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: string, input: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: Priority;
    tags: string[];
  }) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}) {
  const [subtaskTitle, setSubtaskTitle] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!task) return;

    const form = new FormData(event.currentTarget as HTMLFormElement);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const dueDate = String(form.get("dueDate") ?? "");
    const priority = String(form.get("priority") ?? "medium") as Priority;
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean);

    if (!title) return;

    onSave(task.id, {
      title,
      description: description || undefined,
      dueDate: dueDate ? new Date(`${dueDate}T00:00:00`).toISOString() : undefined,
      priority,
      tags,
    });
    onClose();
  };

  const addSubtask = (event: FormEvent) => {
    event.preventDefault();
    if (!task || !subtaskTitle.trim()) return;

    onAddSubtask(task.id, subtaskTitle);
    setSubtaskTitle("");
  };

  return (
    <AnimatePresence>
      {task ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end bg-zinc-950/40 p-3 backdrop-blur-sm sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Task details"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            key={task.id}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xl shadow-zinc-950/20 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/40"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                  Task details
                </p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                  Edit task
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={save} className="mt-6 space-y-4">
              <Field label="Title">
                <Input name="title" defaultValue={task.title} />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  defaultValue={task.description ?? ""}
                  className="min-h-24 w-full rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/10 dark:bg-white/10 dark:text-zinc-50"
                  placeholder="Add context, links, or notes"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Due date">
                  <Input
                    name="dueDate"
                    type="date"
                    defaultValue={
                      task.dueDate ? format(parseISO(task.dueDate), "yyyy-MM-dd") : ""
                    }
                  />
                </Field>
                <Field label="Priority">
                  <select
                    name="priority"
                    defaultValue={task.priority}
                    className="h-11 w-full rounded-xl border border-zinc-200/80 bg-white/80 px-3 text-sm text-zinc-950 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-50 dark:[color-scheme:dark]"
                  >
                    <option className="bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50" value="low">
                      Low
                    </option>
                    <option className="bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50" value="medium">
                      Medium
                    </option>
                    <option className="bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50" value="high">
                      High
                    </option>
                  </select>
                </Field>
              </div>

              <Field label="Tags">
                <Input
                  name="tags"
                  defaultValue={task.tags.join(", ")}
                  placeholder="work, planning"
                />
              </Field>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary">
                  Save changes
                </Button>
              </div>
            </form>

            <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-white/10">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                Subtasks
              </h3>
              <form onSubmit={addSubtask} className="mt-3 flex gap-2">
                <Input
                  value={subtaskTitle}
                  onChange={(event) => setSubtaskTitle(event.target.value)}
                  placeholder="Add a subtask"
                />
                <Button type="submit" variant="secondary" size="icon" aria-label="Add subtask">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              <SubtaskList
                subtasks={task.subtasks}
                onToggle={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
                onDelete={(subtaskId) => onDeleteSubtask(task.id, subtaskId)}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  );
}
