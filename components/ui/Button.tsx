import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 active:bg-indigo-600",
  secondary:
    "border border-zinc-200/70 bg-white/70 text-zinc-900 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-zinc-50 dark:hover:bg-white/15",
  ghost:
    "text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50",
  danger:
    "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400 active:bg-rose-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-11 gap-2 px-4 text-sm",
  icon: "h-10 w-10 p-0",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "secondary", size = "md", type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl font-medium outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
