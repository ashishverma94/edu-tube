import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}

export function StatCard({
  icon,
  label,
  value,
  accent = false,
}: StatCardProps) {
  return (
    <div
      className={[
        "group flex min-w-0 items-center gap-3 rounded-xl border p-2 transition md:p-4",
        accent
          ? "border-primary-800/40 bg-primary-950/20 hover:border-primary-700/60 hover:bg-primary-950/30"
          : "border-border bg-card/80 hover:border-primary-800/60 hover:bg-card-hover",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
          accent
            ? "bg-primary-900/50 text-primary-400"
            : "bg-primary-900/40 text-primary-400 group-hover:bg-primary-900/60",
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
          {label}
        </p>

        <p className="mt-0.5 truncate text-base font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
