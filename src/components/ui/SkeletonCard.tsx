import { Skeleton } from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border-color bg-background">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square rounded-none" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <Skeleton className="h-3 w-16" />
        
        {/* Title */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-8" />
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
