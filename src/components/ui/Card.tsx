import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--surface)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] shadow-[var(--card-shadow)] overflow-hidden transition-all duration-300",
          hoverEffect && "hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] hover:border-[var(--gold)]/40",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
