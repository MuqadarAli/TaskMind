import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm shadow-zinc-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20",
        className,
      )}
    >
      {children}
    </section>
  );
}
