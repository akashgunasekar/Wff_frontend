import * as React from "react";
import { cn } from "@/lib/utils";

export function Divider({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn("border-t border-wff-border my-8", className)}
      {...props}
    />
  );
}
