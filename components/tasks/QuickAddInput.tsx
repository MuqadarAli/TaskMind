"use client";

import { addDays, startOfToday } from "date-fns";
import { ArrowUpRight, Plus } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Priority } from "@/store/useTaskStore";

export function QuickAddInput({
  onAddTask,
}: {
  onAddTask: (input: {
    title: string;
    dueDate?: string;
    priority: Priority;
    tags: string[];
  }) => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = parseQuickAdd(value);
    if (!parsed.title) return;

    onAddTask(parsed);
    setValue("");
  };

  return (
    <Card className="p-3">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Plus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="pl-9"
            placeholder="Add a task, e.g. Send launch notes tomorrow #work high"
            aria-label="Add a task"
          />
        </div>
        <Button type="submit" variant="primary">
          <ArrowUpRight className="h-4 w-4" />
          Add task
        </Button>
      </form>
    </Card>
  );
}

function parseQuickAdd(input: string) {
  let title = input.trim();
  const tags = Array.from(title.matchAll(/#([\w-]+)/g)).map((match) => match[1]);
  title = title.replace(/#([\w-]+)/g, "").trim();

  let priority: Priority = "medium";
  if (/\b(high|urgent|p1)\b/i.test(title)) priority = "high";
  if (/\b(low|someday|p3)\b/i.test(title)) priority = "low";
  title = title.replace(/\b(high priority|low priority|medium priority|urgent|p1|p2|p3)\b/gi, "").trim();

  let dueDate: string | undefined;
  if (/\btoday\b/i.test(title)) {
    dueDate = startOfToday().toISOString();
    title = title.replace(/\btoday\b/gi, "").trim();
  } else if (/\btomorrow\b/i.test(title)) {
    dueDate = addDays(startOfToday(), 1).toISOString();
    title = title.replace(/\btomorrow\b/gi, "").trim();
  } else if (/\bnext week\b/i.test(title)) {
    dueDate = addDays(startOfToday(), 7).toISOString();
    title = title.replace(/\bnext week\b/gi, "").trim();
  }

  return {
    title: title.replace(/\s+/g, " "),
    dueDate,
    priority,
    tags,
  };
}
