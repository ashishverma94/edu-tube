"use client";

import {
  X,
  Play,
  Plus,
  Check,
  Edit3,
  Clock3,
  Search,
  Trash2,
  Loader2,
  StickyNote,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import type { Note } from "@/lib/notesApi";
import { useEffect, useRef, useState } from "react";
import { formatRelativeDate } from "@/utils/functions";

interface NotesPanelProps {
  notes: Note[];
  totalNotes: number;
  search: string;
  onSearch: (value: string) => void;

  onAddNote: () => void;

  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;

  deletingNoteId: string | null;

  editingNoteId: string | null;
  editingText: string;
  editingTimestamp: number;

  onEditingTextChange: (value: string) => void;
  onEditingTimestampChange: (value: number) => void;

  onSaveEdit: () => void;
  onCancelEdit: () => void;

  savingEdit: boolean;

  onJump: (timestamp: number) => void;

  formatTime: (seconds: number) => string;

  libraryId: string;
}

export function NotesPanel({
  notes,
  totalNotes,
  search,
  onSearch,
  onAddNote,
  onEdit,
  onDelete,
  deletingNoteId,
  editingNoteId,
  editingText,
  editingTimestamp,
  onEditingTextChange,
  onEditingTimestampChange,
  onSaveEdit,
  onCancelEdit,
  savingEdit,
  onJump,
  formatTime,
  libraryId,
}: NotesPanelProps) {
  return (
    <div className="flex h-full min-h-105 flex-col">
      {/* HEADER */}

      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-950/70 text-primary-400">
              <StickyNote className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-foreground">
                Study notes
              </h2>

              <p className="text-xs text-muted">
                {totalNotes} {totalNotes === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddNote}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-400"
          >
            <Plus className="h-4 w-4" />
            Add note
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search notes..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary-500"
            />
          </div>

          <Link
            href={`/library/${libraryId}/notes`}
            className="inline-flex shrink-0 cursor-pointer items-center rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-foreground transition hover:bg-card-hover"
          >
            View all
          </Link>
        </div>
      </div>

      {/* NOTES */}

      <div className="min-h-0 flex-1 overflow-y-auto scroll">
        {notes.length === 0 ? (
          <div className="flex h-full min-h-100 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface">
              <StickyNote className="h-6 w-6 text-muted" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No notes found
            </h3>

            <p className="mt-1 max-w-62.5 text-xs leading-5 text-muted">
              {search
                ? "Try another search term."
                : "Start taking notes while studying."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={onAddNote}
                className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary-500 px-3 py-2 text-xs font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add first note
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notes.map((note) => (
              <article
                key={note.id}
                className="group p-4 transition hover:bg-surface/40 sm:p-5"
              >
                <div className="flex gap-3">
                  {/* TIMESTAMP */}

                  <button
                    type="button"
                    onClick={() => onJump(note.timestamp)}
                    className="h-fit shrink-0 cursor-pointer rounded-lg border border-primary-800/60 bg-primary-950/50 px-2 py-2 font-mono text-[10px] font-semibold text-primary-300 transition hover:border-primary-500 hover:bg-primary-900/50"
                  >
                    {formatTime(note.timestamp)}
                  </button>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] font-medium text-muted">
                        {formatRelativeDate(note.updatedAt || note.createdAt)}
                      </p>

                      <NoteMenu
                        note={note}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        deletingNoteId={deletingNoteId}
                      />
                    </div>

                    {editingNoteId === note.id ? (
                      <div className="mt-3">
                        <div className="rounded-xl border border-primary-700 bg-background p-3">
                          <div className="mb-3 flex items-center gap-2">
                            <Clock3 className="h-3.5 w-3.5 text-primary-400" />

                            <input
                              type="number"
                              min={0}
                              value={editingTimestamp}
                              onChange={(event) =>
                                onEditingTimestampChange(
                                  Math.max(0, Number(event.target.value) || 0),
                                )
                              }
                              className="h-8 w-24 rounded-lg border border-border bg-card px-2 font-mono text-xs text-foreground outline-none focus:border-primary-500"
                            />

                            <span className="font-mono text-xs text-primary-300">
                              {formatTime(editingTimestamp)}
                            </span>
                          </div>

                          <textarea
                            value={editingText}
                            onChange={(event) =>
                              onEditingTextChange(event.target.value)
                            }
                            rows={4}
                            maxLength={5000}
                            className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm leading-5 text-foreground outline-none focus:border-primary-500"
                          />
                        </div>

                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={onCancelEdit}
                            disabled={savingEdit}
                            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={onSaveEdit}
                            disabled={savingEdit || !editingText.trim()}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            {savingEdit ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-2 whitespace-pre-wrap wrap-break-words text-sm leading-6 text-foreground/90">
                          {note.content}
                        </p>

                        <button
                          type="button"
                          onClick={() => onJump(note.timestamp)}
                          className="mt-3 inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-primary-400 transition hover:text-primary-300"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          Jump to this moment
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}

      {totalNotes > 0 && (
        <div className="border-t border-border p-4">
          <Link
            href={`/library/${libraryId}/notes`}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-primary-500 px-4 py-2.5 text-xs font-semibold text-foreground transition hover:bg-card-hover"
          >
            View all {totalNotes} notes
          </Link>
        </div>
      )}
    </div>
  );
}

function NoteMenu({
  note,
  onEdit,
  onDelete,
  deletingNoteId,
}: {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  deletingNoteId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      {/* More button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer rounded-lg p-1.5 text-muted transition hover:bg-surface hover:text-foreground"
        aria-label="Note actions"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-30 w-32 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl">
          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit(note);
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-foreground transition hover:bg-surface"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(note.id);
            }}
            disabled={deletingNoteId === note.id}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-error-400 transition hover:bg-error-950/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletingNoteId === note.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}

            {deletingNoteId === note.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
