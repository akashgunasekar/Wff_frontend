import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-wff-border bg-wff-surface px-4 py-2 text-sm text-wff-text-primary shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-wff-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wff-gold focus-visible:border-wff-gold disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
