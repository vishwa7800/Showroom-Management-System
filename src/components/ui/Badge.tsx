import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors gap-1.5 select-none",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-800",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
        warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
        danger: "bg-rose-50 text-rose-700 border border-rose-200/60",
        info: "bg-sky-50 text-sky-700 border border-sky-200/60",
        hero: "bg-hero-50 text-hero-700 border border-hero-200",
        outline: "border border-slate-200 text-slate-700 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
}

function Badge({ className, variant, withDot, children, ...props }: BadgeProps) {
  const dotColorClass = {
    default: "bg-slate-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
    hero: "bg-hero-500",
    outline: "bg-slate-400",
  }[variant || "default"];

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {withDot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColorClass)} />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
