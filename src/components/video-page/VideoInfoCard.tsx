import {
  Play,
  Clock3,
  CheckCircle2,
  StickyNote,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface VideoInfoCardProps {
  video: {
    id?: string;
    title: string;
    channel?: string | null;
    description?: string | null;
    completed?: boolean;
    notes?: unknown[];
  };
  duration: string;
  onViewDescription: () => void;
}

export function VideoInfoCard({
  video,
  duration,
  onViewDescription,
}: VideoInfoCardProps) {
  const notesCount = video.notes?.length ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        {/* Left badges */}
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary-800/50 bg-primary-950/50 px-2.5 py-1 text-[11px] font-semibold text-primary-300">
            YouTube
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted">
            <Clock3 className="h-3 w-3" />
            {duration}
          </span>

          {video.completed && (
            <span className="inline-flex items-center gap-1 rounded-full border border-success-800/50 bg-success-950/30 px-2.5 py-1 text-[11px] font-semibold text-success-400">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </span>
          )}
        </div>

        {/* View notes button */}
        {notesCount > 0 && video.id && (
          <Link
            href={`/library/${video.id}/notes`}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-primary-700/40 bg-linear-to-r from-primary-500/80 via-primary-800/60 to-primary-800/40 p-1.5 pr-4 text-[11px] font-bold text-primary-200 shadow-[0_4px_20px_rgba(220,38,38,0.12)] transition-all duration-200 hover:border-primary-500/60 hover:from-primary-900 hover:via-primary-800/80 hover:to-primary-700/60 hover:text-white hover:shadow-[0_6px_25px_rgba(220,38,38,0.22)]"
          >
            {/* Circular gradient icon */}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary-400 via-primary-600 to-primary-800 text-white shadow-lg shadow-primary-950/40 transition-transform duration-200 group-hover:scale-105">
              <StickyNote className="h-4 w-4" />
            </span>

            {/* Text */}
            <span className="hidden sm:inline">View all notes</span>

            <span className="sm:hidden">Notes</span>

            {/* Arrow */}
            <ArrowRight className="h-3.5 w-3.5 text-primary-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
          </Link>
        )}
      </div>

      {/* Title */}
      <h1 className="mt-4 text-xl font-bold leading-tight text-foreground sm:text-2xl">
        {video.title}
      </h1>

      {/* Channel */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-900/60 text-xs font-bold text-primary-300">
          {video.channel?.slice(0, 2).toUpperCase() || "YT"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {video.channel || "YouTube"}
          </p>

          <p className="text-xs text-muted">Educational content</p>
        </div>
      </div>

      {/* Description */}
      {video.description && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="line-clamp-3 text-sm leading-6 text-muted">
            {video.description}
          </p>

          <button
            type="button"
            onClick={onViewDescription}
            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary-400 transition hover:text-primary-300"
          >
            Read full description
            <Play className="h-3 w-3 rotate-90 fill-current" />
          </button>
        </div>
      )}
    </div>
  );
}
