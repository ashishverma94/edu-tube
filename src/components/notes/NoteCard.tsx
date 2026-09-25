import { type Note } from "@/lib/notesApi";
import { formatRelativeDate, formatTime } from "@/utils/functions";
import { Check, Clock3, Edit3, Loader2, Trash2, X } from "lucide-react";



function NoteCard({
  note,
  index,
  isEditing,
  editingText,
  saving,
  deleting,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onTextChange,
  onDelete,
}: {
  note: Note;
  index: number;
  isEditing: boolean;
  editingText: string;
  editingTimestamp: number;
  saving: boolean;
  deleting: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onTextChange: (value: string) => void;
  onDelete: () => void;
}) {
  if (isEditing) {
    return (
      <article className="overflow-hidden rounded-2xl border border-primary-800/60 bg-card shadow-card">
        <div className="border-b border-border bg-primary-950/15 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900/40 text-primary-400">
                <Edit3 size={15} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">Edit note</p>

                <p className="text-[10px] text-muted">Update your study note</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancelEdit}
              disabled={saving}
              className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-white disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Content */}
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted">
            Note content
          </label>

          <textarea
            autoFocus
            value={editingText}
            onChange={(event) => onTextChange(event.target.value)}
            maxLength={5000}
            rows={7}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-7 text-foreground outline-none placeholder:text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-900/30"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-muted">
              {editingText.length}/5000
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={saving}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted transition hover:bg-surface hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSaveEdit}
                disabled={saving || !editingText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:border-border-hover hover:bg-card-hover">
      {/* Accent */}
      <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-primary-500/0 transition group-hover:bg-primary-500" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* Note number */}
            <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-[10px] font-bold text-muted sm:flex">
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Timestamp */}
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary-800/50 bg-primary-950/40 px-2.5 py-2">
              <Clock3 size={13} className="text-primary-400" />

              <span className="font-mono text-[11px] font-bold text-primary-300">
                {formatTime(note.timestamp)}
              </span>
            </div>

            <span className="truncate text-[10px] text-muted">
              {formatRelativeDate(note.updatedAt || note.createdAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 opacity-70 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={onStartEdit}
              className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-white"
              title="Edit note"
            >
              <Edit3 size={15} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="rounded-lg p-2 text-muted transition hover:bg-error-500/10 hover:text-error-400 disabled:opacity-50"
              title="Delete note"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-5">
          <p className="whitespace-pre-wrap wrap-break-words text-sm leading-7 text-foreground/90 sm:text-[15px]">
            {note.content}
          </p>
        </div>
      </div>
    </article>
  );
}

export default NoteCard;
