import { Check, Clock3, Loader2, X } from "lucide-react";

interface NoteEditorProps {
  timestamp: number;
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  loading: boolean;
}

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));

  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function NoteEditor({
  timestamp,
  value,
  onChange,
  onCancel,
  onSave,
  loading,
}: NoteEditorProps) {
  return (
    <div className="flex h-full min-h-105 flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">
            New note
          </p>

          <h2 className="mt-1 text-base font-bold text-foreground">
            Capture this moment
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-surface hover:text-foreground disabled:opacity-50"
          aria-label="Cancel note"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="rounded-xl border border-primary-900/60 bg-primary-950/20 p-4">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary-400" />

            <span className="font-mono text-sm font-semibold text-primary-300">
              {formatTime(timestamp)}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted">
            This note will be linked to this video timestamp.
          </p>
        </div>

        <textarea
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write what you want to remember..."
          maxLength={5000}
          className="mt-4 min-h-65 flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-900/30"
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">Video is paused while you write.</p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={loading || !value.trim()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
