import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  alignment?: "left" | "center";
}

export function SectionHeader({ className, title, subtitle, eyebrow, align, alignment, ...props }: SectionHeaderProps) {
  const effectiveAlign = align || alignment || "center";
  return (
    <div
      className={cn(
        "flex flex-col mb-12",
        {
          "items-start text-left": effectiveAlign === "left",
          "items-center text-center": effectiveAlign === "center",
        },
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="text-gold-gradient font-bold tracking-[0.2em] uppercase text-sm mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-4xl md:text-5xl text-wff-text-primary uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-wff-muted max-w-2xl text-[17px] font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={cn("h-[3px] w-24 bg-gold-gradient mt-6", effectiveAlign === "center" && "mx-auto")} />
    </div>
  );
}
