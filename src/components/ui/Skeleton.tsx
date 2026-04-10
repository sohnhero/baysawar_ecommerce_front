import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "glass" | "dark";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton rounded-md",
        variant === "glass" && "bg-white/5 backdrop-blur-sm border border-white/10",
        variant === "dark" && "bg-brand-blue/20",
        className
      )}
      {...props}
    />
  );
}
