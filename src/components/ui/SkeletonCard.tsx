export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border-color">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded skeleton" />
        <div className="h-4 w-3/4 rounded skeleton" />
        <div className="h-3 w-20 rounded skeleton" />
        <div className="h-5 w-24 rounded skeleton" />
      </div>
    </div>
  );
}
