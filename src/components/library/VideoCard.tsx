import {
  Play,
  Trash2,
  Clock3,
  FileText,
  StickyNote,
  CheckCircle2,
} from "lucide-react";
import {
  formatDuration,
  formatWatchTime,
  formatRelativeDate,
} from "@/utils/functions";
import Link from "next/link";
import { type LibraryVideo } from "@/lib/libraryApi";

function VideoCard({
  video,
  onDelete,
}: {
  video: LibraryVideo;
  onDelete: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:bg-card-hover hover:shadow-card-hover">
      {/* Thumbnail */}
      <Link href={`/library/${video.id}`}>
        <div className="relative aspect-video overflow-hidden bg-[#18070A]">
          <img
            src={
              video.thumbnail ??
              `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
            }
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/20" />
          <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-md">
            {formatDuration(video.duration)}
          </span>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-maroon-lg">
              <Play size={17} fill="currentColor" className="ml-0.5" />
            </div>
          </div>

          {video.completed && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-green-950/80 px-2 py-1 text-[9px] font-bold text-green-300 backdrop-blur-md">
              <CheckCircle2 size={11} />
              Completed
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/library/${video.id}`} className="min-w-0 flex-1">
            <h3 className="line-clamp-2 min-h-10 font-display text-sm font-bold leading-5 text-white transition-colors group-hover:text-primary-300">
              {video.title}
            </h3>

            <p className="mt-1.5 truncate text-[10px] text-muted">
              {video.channel || "Unknown channel"}
            </p>
          </Link>

          <button
            type="button"
            onClick={onDelete}
            className="shrink-0 cursor-pointer! rounded-lg p-1.5 text-muted transition hover:bg-error-950/40 hover:text-error-400"
            aria-label="Delete video"
            title="Delete video"
          >
            <Trash2 size={16} className="pointer-events-none" />
          </button>
        </div>

        {/* Info row */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <InfoItem
            icon={<Clock3 size={12} />}
            label="Duration"
            value={formatDuration(video.duration)}
          />

          <InfoItem
            icon={<StickyNote size={12} />}
            label="Notes"
            value={String(video.notesCount)}
          />

          <InfoItem
            icon={<Play size={12} />}
            label="Watched"
            value={formatWatchTime(video.watchedSeconds)}
          />
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[9px] font-medium text-muted">
              {video.completed ? "Finished" : "Study progress"}
            </span>

            <span
              className={
                video.progress === 100
                  ? "text-[9px] font-bold text-green-400"
                  : "text-[9px] font-bold text-primary-400"
              }
            >
              {video.progress}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-surface-300">
            <div
              className="h-full rounded-full bg-primary-500 transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, video.progress))}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-[9px] text-muted">
            <FileText size={12} />
            {video.notesCount} {video.notesCount === 1 ? "note" : "notes"}
          </div>

          <span className="text-[9px] text-muted">
            Updated {formatRelativeDate(video.updatedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 px-2.5 py-2">
      <div className="flex items-center gap-1 text-muted">
        {icon}
        <span className="truncate text-[8px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-[10px] font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}
