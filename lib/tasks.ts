import { isAfter, isPast, isToday, parseISO, startOfToday } from "date-fns";
import type { Task } from "@/store/useTaskStore";

export type TaskGroups = {
  overdue: Task[];
  today: Task[];
  upcoming: Task[];
  completed: Task[];
};

export function groupTasks(tasks: Task[]): TaskGroups {
  const open = tasks.filter((task) => !task.completed);

  return {
    overdue: open.filter((task) => {
      if (!task.dueDate) return false;

      const date = parseISO(task.dueDate);
      return isPast(date) && !isToday(date);
    }),
    today: open.filter((task) => task.dueDate && isToday(parseISO(task.dueDate))),
    upcoming: open.filter((task) => {
      if (!task.dueDate) return true;

      return isAfter(parseISO(task.dueDate), startOfToday());
    }),
    completed: tasks.filter((task) => task.completed),
  };
}

export function getVisibleOpenTasks(groups: TaskGroups) {
  return [...groups.overdue, ...groups.today, ...groups.upcoming];
}
