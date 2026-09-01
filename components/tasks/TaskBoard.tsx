"use client";

import { parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, ListFilter } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AiChatPopup } from "@/components/copilot/AiChatPopup";
import { AiTaskTools } from "@/components/copilot/AiTaskTools";
import { BriefingCard } from "@/components/dashboard/BriefingCard";
import { Sidebar, type SidebarView } from "@/components/layout/Sidebar";
import { QuickAddInput } from "@/components/tasks/QuickAddInput";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ThemeToggle } from "@/components/ui/Toggle";
import { groupTasks } from "@/lib/tasks";
import { useTaskStore } from "@/store/useTaskStore";

const priorityRank = { high: 0, medium: 1, low: 2 };

export function TaskBoard() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<SidebarView>("inbox");
  const [isPrioritySorted, setIsPrioritySorted] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const addSubtask = useTaskStore((state) => state.addSubtask);
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask);
  const deleteSubtask = useTaskStore((state) => state.deleteSubtask);

  const groups = useMemo(() => groupTasks(tasks), [tasks]);
  const sidebarCounts = useMemo(
    () => ({
      inbox: groups.overdue.length + groups.today.length + groups.upcoming.length,
      today: groups.today.length,
      completed: groups.completed.length,
    }),
    [groups],
  );

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

  const reorderByPriority = () => {
    const visibleTasks =
      activeView === "completed"
        ? groups.completed
        : activeView === "today"
          ? groups.today
          : [...groups.overdue, ...groups.today, ...groups.upcoming];

    const orderedTaskIds = [...visibleTasks]
      .sort((a, b) => {
        const priority = priorityRank[a.priority] - priorityRank[b.priority];
        if (priority !== 0) return priority;
        const aDate = a.dueDate ? parseISO(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDate = b.dueDate ? parseISO(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aDate - bDate;
      })
      .map((task) => task.id);

    reorderTasks(orderedTaskIds);
    setIsPrioritySorted(true);
    window.setTimeout(() => setIsPrioritySorted(false), 1200);
  };

  if (!mounted) {
    return <TaskBoardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_34rem),linear-gradient(180deg,#f8fafc,#eef2f7)] text-zinc-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_34rem),linear-gradient(180deg,#09090b,#18181b)] dark:text-white">
      <div className="flex min-h-screen">
        <Sidebar
          activeView={activeView}
          counts={sidebarCounts}
          onViewChange={setActiveView}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-7">
            <header className="flex flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm shadow-zinc-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 lg:hidden">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Tuesday focus
                  </p>
                  <h1 className="text-xl font-semibold text-zinc-950 dark:text-white">
                    {activeView === "inbox"
                      ? "TaskMind"
                      : activeView === "today"
                        ? "Today"
                        : "Completed"}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={reorderByPriority}>
                  <ListFilter className="h-4 w-4" />
                  {isPrioritySorted ? "Sorted by priority" : "Reorder by priority"}
                </Button>
                <ThemeToggle />
              </div>
            </header>

            <BriefingCard tasks={tasks} />
            <QuickAddInput onAddTask={addTask} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {activeView === "inbox" ? (
                  <div className="space-y-6">
                    <TaskList
                      title="Overdue"
                      description="Past due tasks that still need a decision."
                      tasks={groups.overdue}
                      onComplete={toggleComplete}
                      onDelete={deleteTask}
                      onOpen={(task) => setSelectedTaskId(task.id)}
                      onReorder={(nextTasks) => reorderTasks(nextTasks.map((task) => task.id))}
                      onToggleSubtask={toggleSubtask}
                    />
                    <TaskList
                      title="Today"
                      description="Work that should stay close at hand."
                      tasks={groups.today}
                      onComplete={toggleComplete}
                      onDelete={deleteTask}
                      onOpen={(task) => setSelectedTaskId(task.id)}
                      onReorder={(nextTasks) => reorderTasks(nextTasks.map((task) => task.id))}
                      onToggleSubtask={toggleSubtask}
                    />
                    <TaskList
                      title="Upcoming"
                      description="Scheduled tasks and unscheduled inbox items."
                      tasks={groups.upcoming}
                      onComplete={toggleComplete}
                      onDelete={deleteTask}
                      onOpen={(task) => setSelectedTaskId(task.id)}
                      onReorder={(nextTasks) => reorderTasks(nextTasks.map((task) => task.id))}
                      onToggleSubtask={toggleSubtask}
                    />
                  </div>
                ) : null}

                {activeView === "today" ? (
                  <TaskList
                    title="Today"
                    description="Only tasks due today."
                    tasks={groups.today}
                    onComplete={toggleComplete}
                    onDelete={deleteTask}
                    onOpen={(task) => setSelectedTaskId(task.id)}
                    onReorder={(nextTasks) => reorderTasks(nextTasks.map((task) => task.id))}
                    onToggleSubtask={toggleSubtask}
                  />
                ) : null}

                {activeView === "completed" ? (
                  <TaskList
                    title="Completed"
                    description="Finished work remains easy to review."
                    tasks={groups.completed}
                    onComplete={toggleComplete}
                    onDelete={deleteTask}
                    onOpen={(task) => setSelectedTaskId(task.id)}
                    onReorder={(nextTasks) => reorderTasks(nextTasks.map((task) => task.id))}
                    onToggleSubtask={toggleSubtask}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onSave={updateTask}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
        onDeleteSubtask={deleteSubtask}
      />
      <AiTaskTools />
      <AiChatPopup />
    </div>
  );
}

function TaskBoardSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-100 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl space-y-5">
        <Skeleton className="h-20" />
        <Skeleton className="h-48" />
        <Skeleton className="h-16" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
}
