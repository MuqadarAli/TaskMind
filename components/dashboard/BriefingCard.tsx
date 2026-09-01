"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, Clock3, Flame } from "lucide-react";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Card } from "@/components/ui/Card";
import { getVisibleOpenTasks, groupTasks } from "@/lib/tasks";
import type { Task } from "@/store/useTaskStore";

export function BriefingCard({ tasks }: { tasks: Task[] }) {
  const groups = groupTasks(tasks);
  const openTasks = getVisibleOpenTasks(groups);
  const todayTasks = groups.today;
  const highPriority = openTasks.filter((task) => task.priority === "high");
  const nextDue = [...openTasks]
    .filter((task) => task.dueDate)
    .sort(
      (a, b) =>
        parseISO(a.dueDate!).getTime() - parseISO(b.dueDate!).getTime(),
    )[0];

  return (
    <Card className="overflow-hidden border-indigo-200/70 bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 p-[1px] dark:border-indigo-400/20">
      <div className="relative overflow-hidden rounded-[15px] bg-white/90 p-5 backdrop-blur dark:bg-zinc-950/78 sm:p-6">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-200">
              <CalendarCheck2 className="h-4 w-4" />
              Daily briefing
            </div>
            <h1 className="mt-3 max-w-2xl text-2xl font-semibold text-zinc-950 dark:text-white sm:text-3xl">
              {todayTasks.length > 0
                ? `${todayTasks.length} task${todayTasks.length === 1 ? "" : "s"} due today.`
                : "Your day is clear, with room to plan ahead."}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {highPriority.length > 0
                ? `Start with ${highPriority[0].title.toLowerCase()} and keep ${highPriority.length} high-priority item${highPriority.length === 1 ? "" : "s"} visible.`
                : "No high-priority work is currently open. Keep momentum by clearing one small task first."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[28rem]">
            <Metric icon={Flame} label="Priority" value={String(highPriority.length)} />
            <Metric
              icon={CalendarCheck2}
              label="Open"
              value={String(openTasks.length)}
            />
            <Metric
              icon={Clock3}
              label="Next due"
              value={
                nextDue?.dueDate
                  ? formatDistanceToNowStrict(parseISO(nextDue.dueDate), {
                      addSuffix: true,
                    })
                  : "None"
              }
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/10 ${className ?? ""}`}
    >
      <Icon className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
