import { Skeleton } from "./Skeleton";

export function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3 relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[2/1] bg-surface">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 flex items-center h-full p-6 sm:p-10 lg:p-14">
          <div className="max-w-xl space-y-6">
            <Skeleton className="h-6 w-32 rounded-full" variant="glass" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-3/4 sm:h-16" variant="glass" />
              <Skeleton className="h-12 w-1/2 sm:h-16" variant="glass" />
            </div>
            <Skeleton className="h-4 w-2/3 sm:h-6" variant="glass" />
            <div className="flex gap-4">
              <Skeleton className="h-14 w-48 rounded-2xl" variant="glass" />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col gap-4">
        <Skeleton className="flex-1 rounded-2xl" />
        <Skeleton className="flex-1 rounded-2xl" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-surface border border-border-color">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
            <Skeleton className="h-10 w-10 rounded-lg" variant="glass" />
            <Skeleton className="h-6 w-1/2" variant="glass" />
            <Skeleton className="h-4 w-full" variant="glass" />
            <Skeleton className="h-3 w-24" variant="glass" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArtisanSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-background rounded-2xl border border-border-color p-6 text-center space-y-4">
          <Skeleton className="w-24 h-24 mx-auto rounded-full" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(j => <Skeleton key={j} className="h-3 w-8" />)}
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-border-color bg-background p-4 space-y-3">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );
}
