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
          "bg-wff-surface rounded-2xl border border-wff-border shadow-sm overflow-hidden transition-all duration-300",
          hoverEffect && "hover:-translate-y-1 hover:shadow-md hover:border-wff-gold/50",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
