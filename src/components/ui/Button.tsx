import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // BASE: sharp corners, typographic tracking, smooth bezier transitions, group for arrow hover
          "group inline-flex items-center justify-center rounded-[2px] font-heading font-bold tracking-[0.12em] uppercase transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
          // STATES: disabled, focus, active
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus:outline-none focus:ring-2 focus:ring-wff-gold focus:ring-offset-2 focus:ring-offset-wff-bg",
          "active:scale-[0.98] active:translate-y-[1px]",
          {
            // PRIMARY
            "bg-wff-navy text-white hover:bg-wff-deep-navy hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(6,20,38,0.15)]": variant === "primary",
            // SECONDARY
            "bg-transparent border border-wff-border text-wff-text-primary hover:border-wff-gold hover:bg-wff-gold/5 hover:text-wff-gold": variant === "secondary",
            // GOLD
            "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(201,164,74,0.3)] tracking-[0.1em] text-[15px]": variant === "gold",
            // SIZES
            "h-10 px-5 text-[13px]": size === "sm",
            "h-12 px-8 text-[14px]": size === "md",
            "h-14 px-10 text-[15px]": size === "lg",
          },
          // Custom class override
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
