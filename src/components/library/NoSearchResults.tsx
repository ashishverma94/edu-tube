import { Search } from "lucide-react";
import { Button } from "../ui/button";

function NoSearchResults({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-87 items-center justify-center rounded-3xl border border-dashed border-border bg-card/40">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-300 text-muted">
          <Search size={22} />
        </div>

        <h3 className="mt-4 font-display text-lg font-bold text-white">
          No videos found
        </h3>

        <p className="mt-2 text-xs text-muted">
          Nothing matched &quot;{search}&quot;.
        </p>

        <Button variant="outline" className="mt-5" onClick={onClear}>
          Clear search
        </Button>
      </div>
    </div>
  );
}

export default NoSearchResults