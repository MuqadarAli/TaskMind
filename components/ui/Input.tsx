import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-zinc-200/80 bg-white/80 px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/10 dark:bg-white/10 dark:text-zinc-50 dark:placeholder:text-zinc-500",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
