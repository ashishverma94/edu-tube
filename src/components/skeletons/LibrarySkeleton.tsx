import VideoCardSkeleton from "./VideoCardSkeleton";

function LibrarySkeleton() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero skeleton */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="h-7 w-32 animate-pulse rounded-lg bg-surface-300" />

              <div className="h-11 w-64 animate-pulse rounded-xl bg-surface-300" />

              <div className="h-4 w-105 max-w-full animate-pulse rounded-lg bg-surface-300" />
            </div>

            <div className="h-12 w-48 animate-pulse rounded-xl bg-surface-300" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="h-8 w-8 animate-pulse rounded-lg bg-surface-300" />

                <div className="mt-4 h-6 w-16 animate-pulse rounded bg-surface-300" />

                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-surface-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="mx-auto max-w-8xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-28 animate-pulse rounded bg-surface-300" />
            <div className="h-3 w-40 animate-pulse rounded bg-surface-300" />
          </div>

          <div className="h-10 w-72 animate-pulse rounded-xl bg-surface-300" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default LibrarySkeleton

