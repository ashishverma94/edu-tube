import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { libraryApi } from "@/lib/libraryApi";
import { CheckCircle2, Loader2, Plus, X } from "lucide-react";

function AddVideoModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (libraryId: string) => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = input.trim();

    if (!value) {
      toast.error("Enter a YouTube video ID or URL");
      return;
    }

    try {
      setLoading(true);

      const response = await libraryApi.addVideo(value);

      toast.success("Video added to your library");

      onAdded(response.data.video.id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to add YouTube video",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-video-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-card-hover"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-900/40 text-primary-400">
              <Plus size={20} />
            </div>

            <div>
              <h2
                id="add-video-title"
                className="font-display text-lg font-bold text-white"
              >
                Add YouTube Video
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted">
                Add a video using its YouTube URL or 11-character video ID.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-muted transition hover:bg-surface-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-6 sm:px-6">
            <label
              htmlFor="youtube-video-input"
              className="mb-2 block text-xs font-semibold text-foreground"
            >
              YouTube video
            </label>

            <input
              id="youtube-video-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Paste YouTube URL or enter video ID"
              autoFocus
              disabled={loading}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-white outline-none transition placeholder:text-muted hover:border-border-hover focus:border-primary-500 focus:ring-4 focus:ring-primary-900/30 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-4 rounded-xl border border-border bg-background/70 p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Accepted formats
              </p>

              <div className="mt-2 space-y-1.5 font-mono text-[10px] text-foreground/70">
                <p>dQw4w9WgXcQ</p>
                <p>youtube.com/watch?v=dQw4w9WgXcQ</p>
                <p>youtu.be/dQw4w9WgXcQ</p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary-900/40 bg-primary-950/20 p-3.5">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-primary-400"
              />

              <p className="text-[10px] leading-5 text-muted">
                We&apos;ll automatically fetch the title, channel, thumbnail,
                description and duration from YouTube.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-border bg-background/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding video...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Video
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVideoModal
