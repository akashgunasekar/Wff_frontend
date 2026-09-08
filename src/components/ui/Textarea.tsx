import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-md border border-wff-border bg-wff-surface px-4 py-3 text-sm text-wff-text-primary shadow-sm transition-colors placeholder:text-wff-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wff-gold focus-visible:border-wff-gold disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea";

export { Textarea };
