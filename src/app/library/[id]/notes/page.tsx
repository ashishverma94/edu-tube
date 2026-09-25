"use client";

import Link from "next/link";
import { toast } from "sonner";
import { libraryApi } from "@/lib/libraryApi";
import { use, useMemo, useState } from "react";
import { formatTime } from "@/utils/functions";
import NoteCard from "@/components/notes/NoteCard";
import { notesApi, type Note } from "@/lib/notesApi";
import { aiApi, type AIChatMessage } from "@/lib/aiApi";
import NoNotesState from "@/components/notes/NoNoteState";
import DeleteNoteModal from "@/components/modals/DeleteNoteModal";
import AIStudyAssistant from "@/components/notes/AiStudyAssistant";
import NotesPageSkeleton from "@/components/skeletons/NotesPageSkeleton";
import { ArrowLeft, Search, Sparkles, StickyNote, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AllNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const queryClient = useQueryClient();

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const [editingText, setEditingText] = useState("");

  const [editingTimestamp, setEditingTimestamp] = useState(0);

  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const [noteSearch, setNoteSearch] = useState("");

  const [aiInput, setAiInput] = useState("");

  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([]);

  const [aiLoading, setAiLoading] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["library-video", id],
    queryFn: () => libraryApi.getById(id),
  });

  const video = data?.data.video;

  const notes = useMemo(() => {
    const allNotes = [...(video?.notes ?? [])];

    const searchValue = noteSearch.trim().toLowerCase();

    const filtered = searchValue
      ? allNotes.filter((note) => {
          const content = note.content.toLowerCase();
          const timestamp = formatTime(note.timestamp);

          return (
            content.includes(searchValue) || timestamp.includes(searchValue)
          );
        })
      : allNotes;

    return filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [video?.notes, noteSearch]);

  const totalNotes = video?.notes?.length ?? 0;

  const updateNoteMutation = useMutation({
    mutationFn: () => {
      if (!editingNoteId) {
        throw new Error("Note not selected");
      }

      if (!editingText.trim()) {
        throw new Error("Note cannot be empty");
      }

      return notesApi.update({
        libraryId: id,
        noteId: editingNoteId,
        timestamp: editingTimestamp,
        content: editingText.trim(),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-video", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["library"],
      });

      toast.success("Note updated");

      cancelEditing();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to update note",
      );
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) =>
      notesApi.delete({
        libraryId: id,
        noteId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-video", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["library"],
      });

      toast.success("Note deleted");

      setDeletingNoteId(null);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete note",
      );

      setDeletingNoteId(null);
    },
  });

  function startEditing(note: Note) {
    setEditingNoteId(note.id);
    setEditingText(note.content);
    setEditingTimestamp(note.timestamp);
  }

  function cancelEditing() {
    setEditingNoteId(null);
    setEditingText("");
    setEditingTimestamp(0);
  }

  function saveEditing() {
    if (!editingText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    updateNoteMutation.mutate();
  }

  async function askAI(question?: string) {
    const value = (question ?? aiInput).trim();

    if (!value || aiLoading) {
      return;
    }

    if (!video?.notes?.length) {
      toast.error("Add some notes before using the AI assistant.");
      return;
    }

    const userMessage: AIChatMessage = {
      role: "user",
      content: value,
    };

    const nextHistory = [...aiMessages, userMessage];

    setAiMessages(nextHistory);
    setAiInput("");
    setAiLoading(true);

    try {
      const response = await aiApi.ask({
        libraryId: id,
        message: value,
        history: nextHistory.slice(-12),
      });

      setAiMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to get AI response",
      );

      setAiMessages((current) => current.slice(0, -1));
    } finally {
      setAiLoading(false);
    }
  }

  if (isLoading) {
    return <NotesPageSkeleton />;
  }

  if (isError || !video) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-950/50 text-primary-400">
              <StickyNote size={24} />
            </div>

            <h1 className="mt-5 font-display text-xl font-bold text-white">
              Notes unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              We couldn't load the notes for this video.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface"
              >
                Try again
              </button>

              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-400"
              >
                <ArrowLeft size={15} />
                Library
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_450px]">
          {/* LEFT */}
          <section className="min-w-0 flex flex-col gap-4">
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex min-w-0 items-end justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/library/${id}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted shadow-card transition hover:border-border-hover hover:bg-card-hover hover:text-white"
                      aria-label="Back to video"
                    >
                      <ArrowLeft size={15} />
                    </Link>

                    <span className="truncate text-[9px] font-bold uppercase tracking-[0.2em] text-primary-400">
                      Study workspace
                    </span>
                  </div>

                  <h1 className="mt-3 max-w-4xl truncate font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {video.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                    {video.channel && (
                      <span className="max-w-55 truncate">{video.channel}</span>
                    )}

                    <span className="flex shrink-0 items-center gap-1.5">
                      <StickyNote size={13} />
                      {totalNotes} notes
                    </span>

                    <span className="flex shrink-0 items-center gap-1.5">
                      <Sparkles size={13} />
                      AI study assistant
                    </span>
                  </div>
                </div>

                {/* Search desktop */}
                <div className="hidden w-full max-w-sm shrink-0 sm:block">
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      type="text"
                      value={noteSearch}
                      onChange={(event) => setNoteSearch(event.target.value)}
                      placeholder="Search notes..."
                      className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-xs text-foreground outline-none transition placeholder:text-muted hover:border-border-hover focus:border-primary-500 focus:ring-4 focus:ring-primary-900/30"
                    />

                    {noteSearch && (
                      <button
                        type="button"
                        onClick={() => setNoteSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:bg-surface hover:text-white"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {noteSearch && (
                    <div className="mt-2 flex justify-end">
                      <span className="rounded-lg bg-primary-950/40 px-2.5 py-1.5 text-[10px] font-semibold text-primary-300">
                        {notes.length}{" "}
                        {notes.length === 1 ? "result" : "results"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Search mobile */}
              <div className="block w-full sm:hidden">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="text"
                    value={noteSearch}
                    onChange={(event) => setNoteSearch(event.target.value)}
                    placeholder="Search notes..."
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-xs text-foreground outline-none transition placeholder:text-muted hover:border-border-hover focus:border-primary-500 focus:ring-4 focus:ring-primary-900/30"
                  />

                  {noteSearch && (
                    <button
                      type="button"
                      onClick={() => setNoteSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:bg-surface hover:text-white"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {noteSearch && (
                  <div className="mt-2">
                    <span className="inline-flex rounded-lg bg-primary-950/40 px-2.5 py-1.5 text-[10px] font-semibold text-primary-300">
                      {notes.length} {notes.length === 1 ? "result" : "results"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {notes.length === 0 ? (
              <NoNotesState
                searched={Boolean(noteSearch)}
                onClearSearch={() => setNoteSearch("")}
              />
            ) : (
              <div className="min-w-0 space-y-3">
                {notes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={index}
                    isEditing={editingNoteId === note.id}
                    editingText={editingText}
                    editingTimestamp={editingTimestamp}
                    saving={updateNoteMutation.isPending}
                    deleting={deleteNoteMutation.isPending}
                    onStartEdit={() => startEditing(note)}
                    onCancelEdit={cancelEditing}
                    onSaveEdit={saveEditing}
                    onTextChange={setEditingText}
                    onDelete={() => setDeletingNoteId(note.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AIStudyAssistant
              messages={aiMessages}
              input={aiInput}
              loading={aiLoading}
              onInputChange={setAiInput}
              onAsk={askAI}
              onClear={() => setAiMessages([])}
            />
          </aside>
        </div>
      </div>

      <DeleteNoteModal
        open={!!deletingNoteId}
        onClose={() => {
          if (!deleteNoteMutation.isPending) {
            setDeletingNoteId(null);
          }
        }}
        onConfirm={() => {
          if (!deletingNoteId) return;

          deleteNoteMutation.mutate(deletingNoteId);
        }}
        loading={deleteNoteMutation.isPending}
      />
    </main>
  );
}
