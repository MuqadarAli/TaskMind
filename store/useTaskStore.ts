import { addDays, startOfToday } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "low" | "medium" | "high";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  completed: boolean;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
}

type AddTaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  tags?: string[];
};

type TaskState = {
  tasks: Task[];
  addTask: (input: AddTaskInput) => Task;
  updateTask: (taskId: string, input: Partial<Omit<Task, "id" | "createdAt">>) => void;
  toggleComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (orderedTaskIds: string[]) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
};

const id = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const due = (daysFromToday: number) =>
  addDays(startOfToday(), daysFromToday).toISOString();

const createSeedTasks = (): Task[] => [
  {
    id: "seed-product-spec",
    title: "Review sprint scope for billing dashboard",
    description: "Tighten acceptance criteria before the planning call.",
    dueDate: due(0),
    priority: "high",
    completed: false,
    tags: ["work", "planning"],
    subtasks: [
      { id: "seed-product-spec-1", title: "Check analytics events", completed: true },
      { id: "seed-product-spec-2", title: "Confirm copy with design", completed: false },
    ],
    createdAt: due(-2),
  },
  {
    id: "seed-inbox-zero",
    title: "Clear finance emails older than Friday",
    dueDate: due(0),
    priority: "medium",
    completed: false,
    tags: ["admin"],
    subtasks: [],
    createdAt: due(-1),
  },
  {
    id: "seed-design-review",
    title: "Send notes on onboarding empty states",
    dueDate: due(1),
    priority: "medium",
    completed: false,
    tags: ["design", "product"],
    subtasks: [],
    createdAt: due(-1),
  },
  {
    id: "seed-renewal",
    title: "Compare software renewal options",
    dueDate: due(3),
    priority: "low",
    completed: false,
    tags: ["ops"],
    subtasks: [
      { id: "seed-renewal-1", title: "Export current seat list", completed: false },
      { id: "seed-renewal-2", title: "Ask vendors for updated pricing", completed: false },
    ],
    createdAt: due(-4),
  },
  {
    id: "seed-report",
    title: "Draft weekly progress summary",
    dueDate: due(4),
    priority: "high",
    completed: false,
    tags: ["writing"],
    subtasks: [],
    createdAt: due(-1),
  },
  {
    id: "seed-backup",
    title: "Back up project notes to Drive",
    priority: "low",
    completed: false,
    tags: ["personal"],
    subtasks: [],
    createdAt: due(-5),
  },
  {
    id: "seed-read",
    title: "Read API changelog before integration pass",
    dueDate: due(-1),
    priority: "medium",
    completed: true,
    tags: ["engineering"],
    subtasks: [],
    createdAt: due(-6),
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: createSeedTasks(),
      addTask: (input) => {
        const task: Task = {
          id: id(),
          title: input.title.trim(),
          description: input.description,
          dueDate: input.dueDate,
          priority: input.priority ?? "medium",
          completed: false,
          tags: input.tags ?? [],
          subtasks: [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ tasks: [task, ...state.tasks] }));
        return task;
      },
      updateTask: (taskId, input) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...input } : task,
          ),
        }));
      },
      toggleComplete: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          ),
        }));
      },
      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },
      reorderTasks: (orderedTaskIds) => {
        const orderedIds = new Set(orderedTaskIds);

        set((state) => ({
          tasks: (() => {
            const tasksById = new Map(state.tasks.map((task) => [task.id, task]));
            const orderedTasks = orderedTaskIds
              .map((taskId) => tasksById.get(taskId))
              .filter((task): task is Task => Boolean(task));
            let nextOrderedIndex = 0;

            return state.tasks.map((task) => {
              if (!orderedIds.has(task.id)) return task;

              return orderedTasks[nextOrderedIndex++] ?? task;
            });
          })(),
        }));
      },
      addSubtask: (taskId, title) => {
        const trimmed = title.trim();
        if (!trimmed) return;

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: [
                    ...task.subtasks,
                    { id: id(), title: trimmed, completed: false },
                  ],
                }
              : task,
          ),
        }));
      },
      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, completed: !subtask.completed }
                      : subtask,
                  ),
                }
              : task,
          ),
        }));
      },
      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
                }
              : task,
          ),
        }));
      },
    }),
    {
      name: "taskmind-tasks",
      partialize: (state) => ({ tasks: state.tasks }),
    },
  ),
);
