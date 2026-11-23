import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "navy" | "gold" | "outline" | "success" | "pending" | "danger" | "neutral";
}

export function Badge({ className, variant = "navy", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors",
        {
          "bg-[var(--navy)] text-white": variant === "navy",
          "bg-[var(--gold)] text-[#040A12] font-extrabold": variant === "gold",
          "bg-transparent border border-[var(--border-color)] text-[var(--text-body)]": variant === "outline",
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25": variant === "success",
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25": variant === "pending",
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25": variant === "danger",
          "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20": variant === "neutral",
        },
        className
      )}
      {...props}
    />
  );
}
