"use client";

import {
  X,
  Plus,
  Clock3,
  Search,
  BookOpen,
  StickyNote,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatWatchTime } from "@/utils/functions";
import VideoCard from "@/components/library/VideoCard";
import { StatCard } from "@/components/library/StatCard";
import Decoration from "@/components/library/Decoration";
import EmptyLibrary from "@/components/library/EmptyLibrary";
import AddVideoModal from "@/components/modals/AddVideoModal";
import { libraryApi, type LibraryVideo } from "@/lib/libraryApi";
import NoSearchResults from "@/components/library/NoSearchResults";
import DeleteVideoModal from "@/components/modals/DeleteVideoModal";
import LibrarySkeleton from "@/components/skeletons/LibrarySkeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function LibraryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<LibraryVideo | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["library"],
    queryFn: libraryApi.getAll,
  });

  const videos = data?.data.library ?? [];

  const filteredVideos = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return videos;

    return videos.filter((video) => {
      return (
        video.title.toLowerCase().includes(value) ||
        video.channel?.toLowerCase().includes(value)
      );
    });
  }, [videos, search]);

  const stats = useMemo(() => {
    const totalNotes = videos.reduce(
      (total, video) => total + video.notesCount,
      0,
    );

    const totalWatchSeconds = videos.reduce(
      (total, video) => total + video.watchedSeconds,
      0,
    );

    const completedVideos = videos.filter((video) => video.completed).length;

    const averageProgress =
      videos.length > 0
        ? Math.round(
            videos.reduce((total, video) => total + video.progress, 0) /
              videos.length,
          )
        : 0;

    return {
      totalVideos: videos.length,
      totalNotes,
      totalWatchSeconds,
      completedVideos,
      averageProgress,
    };
  }, [videos]);

  const deleteMutation = useMutation({
    mutationFn: (libraryId: string) => libraryApi.delete(libraryId),

    onSuccess: () => {
      toast.success("Video removed from your library");

      setVideoToDelete(null);

      queryClient.invalidateQueries({
        queryKey: ["library"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove this video",
      );
    },
  });

  if (isLoading) {
    return <LibrarySkeleton />;
  }

  if (isError) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-150 items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-error-900/50 bg-card p-8 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error-950/40 text-error-400">
              <BookOpen size={24} />
            </div>

            <h2 className="mt-5 font-display text-xl font-bold text-white">
              Unable to load your library
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading your videos."}
            </p>

            <Button className="mt-6" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] pb-5 bg-background">
        <section className="relative overflow-hidden border-b border-border">
          <Decoration />

          <div className="relative mx-auto max-w-8xl px-4 py-2 sm:px-6 lg:px-8">
            <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(480px,560px)] xl:gap-10">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-900/40 text-primary-400">
                    <BookOpen size={15} />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400">
                    Your study space
                  </span>
                </div>

                <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Your Library
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                  Keep your learning organized, continue where you left off, and
                  turn every video into a personal study session.
                </p>

                {/* Add video — desktop */}
                <div className="mt-2 hidden sm:block">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus size={17} />
                    Add YouTube Video
                  </Button>
                </div>
              </div>

              <div className="min-w-0">
                <div className="grid grid-cols-2 gap-2.5">
                  <StatCard
                    icon={<BookOpen size={15} />}
                    label="Videos"
                    value={stats.totalVideos}
                  />

                  <StatCard
                    icon={<StickyNote size={15} />}
                    label="Notes"
                    value={stats.totalNotes}
                  />

                  <StatCard
                    icon={<Clock3 size={15} />}
                    label="Watch time"
                    value={formatWatchTime(stats.totalWatchSeconds)}
                  />

                  <StatCard
                    icon={<TrendingUp size={15} />}
                    label="Avg. progress"
                    value={`${stats.averageProgress}%`}
                    accent
                  />
                </div>

                {/* Add video — mobile */}
                <div className="mt-3 sm:hidden">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus size={17} />
                    Add YouTube Video
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-8xl px-4 py-3 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Your videos
              </h2>

              <p className="mt-1 text-xs text-muted">
                {filteredVideos.length}{" "}
                {filteredVideos.length === 1 ? "video" : "videos"} in your
                library
              </p>
            </div>

            <div className="flex w-full gap-2 md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search videos..."
                  className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-muted hover:border-border-hover focus:border-primary-500 focus:ring-4 focus:ring-primary-900/30"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Video grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onDelete={() => setVideoToDelete(video)}
                />
              ))}
            </div>
          ) : search ? (
            <NoSearchResults search={search} onClear={() => setSearch("")} />
          ) : (
            <EmptyLibrary onAdd={() => setShowAddModal(true)} />
          )}
        </section>
      </main>

      {showAddModal && (
        <AddVideoModal
          onClose={() => setShowAddModal(false)}
          onAdded={(libraryId) => {
            queryClient.invalidateQueries({
              queryKey: ["library"],
            });

            setShowAddModal(false);

            router.push(`/library/${libraryId}`);
          }}
        />
      )}

      {videoToDelete && (
        <DeleteVideoModal
          title=""
          video={videoToDelete}
          loading={deleteMutation.isPending}
          onClose={() => {
            if (!deleteMutation.isPending) {
              setVideoToDelete(null);
            }
          }}
          onConfirm={() => {
            deleteMutation.mutate(videoToDelete.id);
          }}
        />
      )}
    </>
  );
}
