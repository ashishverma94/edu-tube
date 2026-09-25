import { ChevronRight, Sparkles, StickyNote, Timer } from "lucide-react";
import React from "react";

const FeaturesSection = () => {
  return (
    <section id="features" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-400">
              Everything connected
            </p>

            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your video becomes
              <span className="text-primary-400"> your study material.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
              EduTube keeps the video, your notes and your progress connected,
              so you can spend less time organizing and more time learning.
            </p>

            <div className="mt-8 space-y-5">
              <FeatureRow
                icon={<StickyNote size={17} />}
                title="Notes attached to timestamps"
                description="Every note remembers exactly where you made it."
              />

              <FeatureRow
                icon={<Timer size={17} />}
                title="Automatic progress tracking"
                description="Continue exactly where you stopped watching."
              />

              <FeatureRow
                icon={<Sparkles size={17} />}
                title="AI-powered revision"
                description="Generate summaries and revision material from your notes."
                badge="Coming soon"
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-primary-700/10 blur-3xl" />

            <div className="relative rounded-3xl border border-border bg-card p-4 shadow-card sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-primary-400">
                    Your notes
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-white">
                    Next.js 16 Full Course
                  </p>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-900/30 text-primary-400">
                  <StickyNote size={15} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <StudyNote
                  time="08:24"
                  title="App Router"
                  text="The App Router uses React Server Components by default."
                  active
                />

                <StudyNote
                  time="24:18"
                  title="Server Components"
                  text="Server components can access server-side resources directly."
                />

                <StudyNote
                  time="41:32"
                  title="Client Components"
                  text="Use 'use client' when the component needs browser interaction."
                />

                <StudyNote
                  time="58:04"
                  title="Data Fetching"
                  text="Fetch data directly inside async server components."
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                <span className="text-[9px] text-muted">
                  4 notes in this session
                </span>

                <span className="flex items-center gap-1 text-[9px] font-semibold text-primary-400">
                  Open video
                  <ChevronRight size={11} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

function FeatureRow({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-900/30 text-primary-400">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-white">{title}</h3>

          {badge && (
            <span className="rounded-full bg-primary-900/30 px-2 py-0.5 text-[8px] font-bold text-primary-300">
              {badge}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      </div>
    </div>
  );
}

function StudyNote({
  time,
  title,
  text,
  active = false,
}: {
  time: string;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 transition-all ${
        active
          ? "border-primary-800/60 bg-primary-900/10"
          : "border-border bg-background/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 shrink-0 rounded-md px-1.5 py-1 text-[8px] font-bold ${
            active
              ? "bg-primary-900/50 text-primary-300"
              : "bg-surface-300 text-muted"
          }`}
        >
          {time}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white">{title}</p>

          <p className="mt-1 text-[9px] leading-4 text-muted">{text}</p>
        </div>
      </div>
    </div>
  );
}
