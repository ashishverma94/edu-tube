"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { progressApi } from "@/lib/progressApi";
import { ArrowLeft, BookOpen } from "lucide-react";
import { notesApi, type Note } from "@/lib/notesApi";
import { NoteEditor } from "@/components/video-page/NoteEditor";
import { NotesPanel } from "@/components/video-page/NotesPanel";
import { DescriptionModal } from "@/components/modals/DescModal";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { VideoPlayer } from "@/components/video-page/VideoPlayer";
import { formatDuration, formatWatchTime } from "@/utils/functions";
import { StudyProgress } from "@/components/video-page/StudyProgress";
import { VideoInfoCard } from "@/components/video-page/VideoInfoCard";
import { libraryApi, type LibraryVideoDetail } from "@/lib/libraryApi";
import StudyPageLoading from "@/components/video-page/StudyPageLoading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: string | HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;

      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };

    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeAPI() {
  return new Promise<void>((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existingScript) {
      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve();
      };

      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };

    const script = document.createElement("script");

    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    document.body.appendChild(script);
  });
}

export default function LibraryVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: libraryId } = use(params);

  const queryClient = useQueryClient();

  const playerRef = useRef<YouTubePlayer | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);

  const [currentTime, setCurrentTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState("");

  const [noteSearch, setNoteSearch] = useState("");

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingTimestamp, setEditingTimestamp] = useState(0);

  const [showDescription, setShowDescription] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["library-video", libraryId],
    queryFn: () => libraryApi.getById(libraryId),
    enabled: Boolean(libraryId),
  });

  const video: LibraryVideoDetail | undefined = data?.data.video;

  const notes: Note[] = video?.notes ?? [];

  const progress = useMemo(() => {
    if (!video?.duration) {
      return 0;
    }

    return Math.min(100, Math.round((currentTime / video.duration) * 100));
  }, [currentTime, video?.duration]);

  const remainingSeconds = Math.max((video?.duration ?? 0) - currentTime, 0);

  const filteredNotes = useMemo(() => {
    const query = noteSearch.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter((note) => note.content.toLowerCase().includes(query));
  }, [notes, noteSearch]);

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  async function saveProgress() {
    if (!video) {
      return;
    }

    const watchedSeconds = Math.floor(currentTimeRef.current);

    const durationSeconds = Math.floor(
      durationRef.current || video.duration || 0,
    );

    if (durationSeconds <= 0) {
      return;
    }

    try {
      await progressApi.update({
        libraryId,
        watchedSeconds,
        durationSeconds,
        completed: watchedSeconds >= durationSeconds - 3,
      });
    } catch (error) {
      console.error("SAVE_PROGRESS_ERROR:", error);
    }
  }

  const addNoteMutation = useMutation({
    mutationFn: () =>
      notesApi.create({
        libraryId,
        timestamp: Math.floor(currentTimeRef.current),
        content: noteText.trim(),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-video", libraryId],
      });

      queryClient.invalidateQueries({
        queryKey: ["library"],
      });

      toast.success("Note added");

      setNoteText("");
      setShowAddNote(false);

      // Resume video after saving.
      playerRef.current?.playVideo();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to add note",
      );
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: () => {
      if (!editingNoteId) {
        throw new Error("Note not selected");
      }

      return notesApi.update({
        libraryId,
        noteId: editingNoteId,
        timestamp: editingTimestamp,
        content: editingText.trim(),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-video", libraryId],
      });

      queryClient.invalidateQueries({
        queryKey: ["library"],
      });

      toast.success("Note updated");

      setEditingNoteId(null);
      setEditingText("");
      setEditingTimestamp(0);
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
        libraryId,
        noteId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-video", libraryId],
      });

      queryClient.invalidateQueries({
        queryKey: ["library"],
      });

      toast.success("Note deleted");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete note",
      );
    },
  });

  useEffect(() => {
    if (!video?.videoId) {
      return;
    }

    let cancelled = false;

    async function initializePlayer() {
      await loadYouTubeAPI();

      if (cancelled || !window.YT?.Player) {
        return;
      }

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      if (!video) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: video.videoId,

        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
        },

        events: {
          onReady: ({ target }) => {
            if (cancelled) {
              return;
            }

            setPlayerReady(true);

            const duration = target.getDuration() || video.duration || 0;

            durationRef.current = duration;

            const watched = video.watchedSeconds || 0;

            currentTimeRef.current = watched;

            setCurrentTime(watched);

            if (watched > 0 && watched < duration) {
              target.seekTo(watched, true);
            }
          },

          onStateChange: ({ data }) => {
            if (!window.YT?.PlayerState) {
              return;
            }

            const states = window.YT.PlayerState;

            if (data === states.PLAYING) {
              if (progressTimerRef.current) {
                clearInterval(progressTimerRef.current);
              }

              progressTimerRef.current = setInterval(() => {
                const player = playerRef.current;

                if (!player) {
                  return;
                }

                const time = player.getCurrentTime();

                currentTimeRef.current = time;

                setCurrentTime(time);
              }, 1000);
            }

            if (data === states.PAUSED || data === states.ENDED) {
              if (progressTimerRef.current) {
                clearInterval(progressTimerRef.current);
                progressTimerRef.current = null;
              }

              const player = playerRef.current;

              if (player) {
                const time = player.getCurrentTime();

                currentTimeRef.current = time;
                setCurrentTime(time);
              }

              void saveProgress();
            }

            if (data === states.ENDED) {
              currentTimeRef.current = durationRef.current;

              setCurrentTime(durationRef.current);

              void progressApi.update({
                libraryId,
                watchedSeconds: Math.floor(durationRef.current),
                durationSeconds: Math.floor(durationRef.current),
                completed: true,
              });

              queryClient.invalidateQueries({
                queryKey: ["library-video", libraryId],
              });

              queryClient.invalidateQueries({
                queryKey: ["library"],
              });
            }
          },
        },
      });
    }

    void initializePlayer();

    return () => {
      cancelled = true;

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [video?.videoId, libraryId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      void saveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [video?.id, libraryId]);

  function openAddNote() {
    if (!playerReady || !playerRef.current) {
      toast.error("Video player is still loading");
      return;
    }

    const timestamp = Math.floor(playerRef.current.getCurrentTime());

    // Pause immediately.
    playerRef.current.pauseVideo();

    currentTimeRef.current = timestamp;
    setCurrentTime(timestamp);

    setNoteText("");
    setEditingNoteId(null);
    setEditingText("");
    setShowAddNote(true);
  }

  function cancelAddNote() {
    setShowAddNote(false);
    setNoteText("");

    // Resume video if user cancels.
    playerRef.current?.playVideo();
  }

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

  function jumpToTimestamp(timestamp: number) {
    const player = playerRef.current;

    if (!player) {
      toast.error("Video player is still loading");
      return;
    }

    player.seekTo(timestamp, true);
    player.playVideo();

    currentTimeRef.current = timestamp;
    setCurrentTime(timestamp);
  }

  if (isLoading) {
    return <StudyPageLoading />;
  }

  if (isError || !video) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-950/60 text-primary-400">
              <BookOpen className="h-6 w-6" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-foreground">
              Unable to load this study session
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              {error instanceof Error
                ? error.message
                : "The video could not be found."}
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>

              <Link href="/library">
                <Button variant="primary">Back to library</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-background">
      <div className="mx-auto max-w-8xl px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
        </div>

        <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
          <section className="flex min-w-0 flex-col gap-5">
            <VideoPlayer videoId={video.videoId} playerReady={playerReady} />

            <StudyProgress
              currentTime={currentTime}
              duration={video.duration}
              progress={progress}
              remainingSeconds={remainingSeconds}
            />

            <VideoInfoCard
              video={video}
              duration={formatDuration(video.duration)}
              onViewDescription={() => setShowDescription(true)}
            />
          </section>

          <aside className="min-w-0">
            <div className="flex h-full min-h-115  max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {showAddNote ? (
                <NoteEditor
                  timestamp={currentTime}
                  value={noteText}
                  onChange={setNoteText}
                  onCancel={cancelAddNote}
                  onSave={() => addNoteMutation.mutate()}
                  loading={addNoteMutation.isPending}
                />
              ) : (
                <NotesPanel
                  notes={sortedNotes}
                  totalNotes={notes.length}
                  search={noteSearch}
                  onSearch={setNoteSearch}
                  onAddNote={openAddNote}
                  onEdit={startEditing}
                  onDelete={(noteId) => deleteNoteMutation.mutate(noteId)}
                  deletingNoteId={
                    deleteNoteMutation.isPending
                      ? deleteNoteMutation.variables
                      : null
                  }
                  editingNoteId={editingNoteId}
                  editingText={editingText}
                  editingTimestamp={editingTimestamp}
                  onEditingTextChange={setEditingText}
                  onEditingTimestampChange={setEditingTimestamp}
                  onSaveEdit={() => updateNoteMutation.mutate()}
                  onCancelEdit={cancelEditing}
                  savingEdit={updateNoteMutation.isPending}
                  onJump={jumpToTimestamp}
                  formatTime={formatWatchTime}
                  libraryId={libraryId}
                />
              )}
            </div>
          </aside>
        </div>
      </div>

      {showDescription && (
        <DescriptionModal
          title={video.title}
          description={video.description || "No description available."}
          onClose={() => setShowDescription(false)}
        />
      )}
    </main>
  );
}
