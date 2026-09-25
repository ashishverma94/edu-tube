import { Button } from "../ui/button";
import { BookOpen, Plus } from "lucide-react";

function EmptyLibrary({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-107.5 items-center justify-center rounded-3xl border border-dashed border-border bg-card/40">
      <div className="max-w-sm px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-900/30 text-primary-400">
          <BookOpen size={26} />
        </div>

        <h3 className="mt-5 font-display text-lg font-bold text-white">
          Your library is empty
        </h3>

        <p className="mt-2 text-xs leading-5 text-muted">
          Add your first educational YouTube video and start creating
          timestamped notes.
        </p>

        <Button variant="primary" size="lg" className="mt-5" onClick={onAdd}>
          <Plus size={16} />
          Add your first video
        </Button>
      </div>
    </div>
  );
}

export default EmptyLibrary