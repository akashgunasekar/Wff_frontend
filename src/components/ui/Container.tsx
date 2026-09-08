import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-8",
        {
          "max-w-3xl": size === "sm",
          "max-w-5xl": size === "default",
          "max-w-7xl": size === "lg",
          "max-w-full": size === "xl",
        },
        className
      )}
      {...props}
    />
  );
}
