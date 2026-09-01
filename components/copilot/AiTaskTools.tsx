"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useTaskStore, type Priority } from "@/store/useTaskStore";

const prioritySchema = z.enum(["low", "medium", "high"]);

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

function findTaskTitle(taskId: string) {
  return useTaskStore.getState().tasks.find((task) => task.id === taskId)?.title;
}

export function AiTaskTools() {
  useFrontendTool({
    name: "getTasks",
    description:
      "Read the user's current TaskMind todo list. Use this before updating or deleting tasks so you have the correct task id.",
    parameters: z.object({}),
    handler: async () => {
      return JSON.stringify(useTaskStore.getState().tasks);
    },
  });

  useFrontendTool({
    name: "createTask",
    description: "Create a new todo task in TaskMind.",
    parameters: z.object({
      title: z.string().trim().min(1, "A task title is required."),
      description: optionalTextSchema,
      dueDate: z
        .string()
        .trim()
        .optional()
        .describe("Optional ISO date string, for example 2026-09-01T09:00:00.000Z."),
      priority: prioritySchema.default("medium"),
      tags: z.array(z.string().trim().min(1)).optional(),
    }),
    handler: async (input) => {
      const task = useTaskStore.getState().addTask({
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        priority: input.priority as Priority,
        tags: input.tags,
      });

      return `Created task "${task.title}" with id ${task.id}.`;
    },
  });

  useFrontendTool({
    name: "updateTask",
    description:
      "Update an existing TaskMind task. Call getTasks first if you do not know the task id.",
    parameters: z.object({
      taskId: z.string().min(1),
      title: optionalTextSchema,
      description: optionalTextSchema,
      dueDate: z
        .string()
        .trim()
        .optional()
        .describe("Optional ISO date string, for example 2026-09-01T09:00:00.000Z."),
      priority: prioritySchema.optional(),
      completed: z.boolean().optional(),
      tags: z.array(z.string().trim().min(1)).optional(),
    }),
    handler: async (input) => {
      const currentTitle = findTaskTitle(input.taskId);

      if (!currentTitle) {
        return `No task found with id ${input.taskId}.`;
      }

      const updates = {
        ...(input.title ? { title: input.title } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.dueDate ? { dueDate: input.dueDate } : {}),
        ...(input.priority ? { priority: input.priority as Priority } : {}),
        ...(typeof input.completed === "boolean" ? { completed: input.completed } : {}),
        ...(input.tags ? { tags: input.tags } : {}),
      };

      useTaskStore.getState().updateTask(input.taskId, updates);

      return `Updated task "${input.title ?? currentTitle}".`;
    },
  });

  useFrontendTool({
    name: "deleteTask",
    description:
      "Delete a task from TaskMind. Call getTasks first if you do not know the task id.",
    parameters: z.object({
      taskId: z.string().min(1),
    }),
    handler: async (input) => {
      const title = findTaskTitle(input.taskId);

      if (!title) {
        return `No task found with id ${input.taskId}.`;
      }

      useTaskStore.getState().deleteTask(input.taskId);

      return `Deleted task "${title}".`;
    },
  });

  return null;
}
