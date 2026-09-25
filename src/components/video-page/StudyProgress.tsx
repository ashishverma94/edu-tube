import { BarChart3, CheckCircle2 } from "lucide-react";

interface StudyProgressProps {
  currentTime: number;
  duration: number;
  progress: number;
  remainingSeconds: number;
}

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));

  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function StudyProgress({
  currentTime,
  duration,
  progress,
  remainingSeconds,
}: StudyProgressProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary-400" />

            <span className="text-sm font-semibold text-foreground">
              Your progress
            </span>
          </div>

          <p className="mt-1 text-xs text-muted">
            {formatTime(currentTime)} watched of {formatTime(duration)}
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary-400" />

            <span className="text-xs font-medium text-foreground">
              {progress}% watched
            </span>
          </div>

          <p className="mt-1 text-[11px] text-muted">
            {formatTime(remainingSeconds)} left
          </p>
        </div>
      </div>

      <div className="mt-4 border-primary-300/30 border h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
