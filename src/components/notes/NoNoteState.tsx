import { Search, StickyNote } from "lucide-react";

function NoNotesState({
  searched,
  onClearSearch,
}: {
  searched: boolean;
  onClearSearch: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-900/30 text-primary-400">
        {searched ? <Search size={23} /> : <StickyNote size={23} />}
      </div>

      <h3 className="mt-5 font-display text-base font-bold text-white">
        {searched ? "No matching notes" : "No notes yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-muted">
        {searched
          ? "Try a different search term to find the note you're looking for."
          : "Go back to the video and start capturing important moments."}
      </p>

      {searched && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-5 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted transition hover:bg-surface hover:text-white"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

export default NoNotesState;
