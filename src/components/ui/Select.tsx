import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full appearance-none rounded-md border border-wff-border bg-wff-surface px-4 py-2 text-sm text-wff-text-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wff-gold focus-visible:border-wff-gold disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
