import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { type LibraryVideo } from "@/lib/libraryApi";

function DeleteVideoModal({
  title,
  video,
  loading,
  onClose,
  onConfirm,
}: {
  title:string
  video: LibraryVideo;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-950/40 text-error-400">
          <Trash2 className="h-5 w-5" />
        </div>

        <h2 className="mt-5 font-display text-lg font-bold text-foreground">
          Remove this video?
        </h2>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
          &quot;{video.title}&quot;
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          This will permanently remove the video, its notes and saved watch
          progress from your library.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Remove video
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteVideoModal
