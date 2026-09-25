function VideoCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-video animate-pulse bg-surface-300" />

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-surface-300" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-surface-300" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-surface-300" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-surface-300"
            />
          ))}
        </div>

        <div>
          <div className="mb-2 h-3 w-full animate-pulse rounded bg-surface-300" />
          <div className="h-1.5 w-full animate-pulse rounded-full bg-surface-300" />
        </div>

        <div className="h-5 w-full animate-pulse rounded bg-surface-300" />
      </div>
    </div>
  );
}

export default VideoCardSkeleton;
