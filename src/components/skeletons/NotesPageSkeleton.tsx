function NotesPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Top */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-surface" />

          <div className="h-8 w-24 animate-pulse rounded-lg bg-surface" />
        </div>

        {/* Header */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card p-6">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-surface" />

          <div className="mt-5 h-8 w-3/4 animate-pulse rounded-lg bg-surface" />

          <div className="mt-3 h-4 w-48 animate-pulse rounded bg-surface" />

          <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-surface" />
        </div>

        {/* Workspace */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex justify-between">
                  <div className="h-8 w-28 animate-pulse rounded-lg bg-surface" />

                  <div className="h-8 w-16 animate-pulse rounded-lg bg-surface" />
                </div>

                <div className="mt-5 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-surface" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-surface" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />
                </div>

                <div className="mt-5 h-4 w-24 animate-pulse rounded bg-surface" />
              </div>
            ))}
          </div>

          {/* AI skeleton */}
          <div className="h-130 animate-pulse rounded-2xl border border-border bg-card" />
        </div>
      </div>
    </main>
  );
}

export default NotesPageSkeleton