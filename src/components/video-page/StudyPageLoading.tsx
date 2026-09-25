function StudyPageLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-8xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-5 h-10 w-36 animate-pulse rounded-xl bg-surface" />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="space-y-5">
            <div className="aspect-video animate-pulse rounded-2xl bg-surface" />
            <div className="h-28 animate-pulse rounded-2xl bg-surface" />
            <div className="h-48 animate-pulse rounded-2xl bg-surface" />
          </div>

          <div className="min-h-155 animate-pulse rounded-2xl bg-surface" />
        </div>
      </div>
    </main>
  );
}
export default StudyPageLoading