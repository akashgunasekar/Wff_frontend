import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "navy" | "gold" | "outline";
}

export function Badge({ className, variant = "navy", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase",
        {
          "bg-wff-navy text-white": variant === "navy",
          "bg-wff-gold text-wff-deep-navy": variant === "gold",
          "bg-transparent border border-wff-border text-wff-text-body": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
