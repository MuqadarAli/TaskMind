import { CalendarDays, CheckCircle2, Inbox, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    id: "inbox",
    label: "Inbox",
    description: "All open tasks",
    icon: Inbox,
  },
  {
    id: "today",
    label: "Today",
    description: "Due today",
    icon: CalendarDays,
  },
  {
    id: "completed",
    label: "Completed",
    description: "Finished tasks",
    icon: CheckCircle2,
  },
] as const;

export type SidebarView = (typeof navItems)[number]["id"];

export function Sidebar({
  activeView,
  counts,
  onViewChange,
}: {
  activeView: SidebarView;
  counts: Record<SidebarView, number>;
  onViewChange: (view: SidebarView) => void;
}) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-200/70 bg-white/70 px-5 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25">
          <ListTodo className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">TaskMind</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Focused task planning</p>
        </div>
      </div>

      <nav className="mt-10 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={activeView === item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition",
              activeView === item.id
                ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{item.label}</span>
              <span
                className={cn(
                  "block text-xs",
                  activeView === item.id
                    ? "text-white/65 dark:text-zinc-950/60"
                    : "text-zinc-400 dark:text-zinc-500",
                )}
              >
                {item.description}
              </span>
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                activeView === item.id
                  ? "bg-white/15 text-white dark:bg-zinc-950/10 dark:text-zinc-950"
                  : "bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400",
              )}
            >
              {counts[item.id]}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
