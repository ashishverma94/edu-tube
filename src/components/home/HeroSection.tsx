"use client";

import {
  Play,
  Timer,
  Library,
  Sparkles,
  ArrowRight,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import HeroBackground from "./HeroBackground";
import { useAuthStore } from "@/store/useAuthStore";

const HeroSection = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  return (
    <section
      id="home"
      className="relative min-h-[calc(100svh-4rem)] overflow-hidden w-full"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-350 items-center px-4 py-14 sm:px-6 sm:py-16 md:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 xl:gap-14 2xl:gap-20">
          {/* LEFT */}
          <div className="max-w-2xl max-md:flex max-md:flex-col max-md:items-center max-md:justify-center">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-primary-800/60 bg-primary-900/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-primary-300 sm:mb-6 sm:text-[10px]">
              <Sparkles size={12} className="shrink-0" />A better way to learn
              from video
            </div>

            <h1 className="font-display text-[2.2rem] font-extrabold text-white max-md:text-center sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              <span className="mr-4 text-primary-400">Don't</span>
              just
              <span className="ml-3 text-primary-400 sm:ml-4">watch.</span>
              <span className="block text-white/75">Understand.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-6 text-muted-foreground max-md:text-center sm:mt-7 sm:text-base sm:leading-7 md:text-lg md:leading-8">
              Turn long educational YouTube videos into a focused study
              experience. Save your videos, create timestamped notes, and track
              exactly how far you've learned.
            </p>

            {/* CTA */}
            <div className="mt-7 flex items-center gap-3 max-md:justify-center sm:mt-8">
              {isAuthLoading ? (
                <div className="h-11 w-32 animate-pulse rounded-xl bg-surface-300" />
              ) : isAuthenticated ? (
                <Link href="/library">
                  <Button
                    variant="primary"
                    size="lg"
                    className="shadow-maroon-sm"
                  >
                    View Library
                    <ArrowRight size={15} />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button
                    variant="primary"
                    size="lg"
                    className="shadow-maroon-sm"
                  >
                    Get Started
                    <ArrowRight size={15} />
                  </Button>
                </Link>
              )}
            </div>

            {/* TRUST */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-muted max-md:justify-center sm:mt-7 sm:gap-x-5">
              <span className="flex items-center gap-1.5">
                <StickyNote size={12} />
                Timestamped notes
              </span>

              <span className="flex items-center gap-1.5">
                <Timer size={12} />
                Progress tracking
              </span>

              <span className="flex items-center gap-1.5">
                <Sparkles size={12} />
                AI powered
              </span>
            </div>
          </div>
          {/* RIGHT PRODUCT PREVIEW */}
          <div className="relative mx-auto w-full max-w-155 lg:mx-0">
            <div className="absolute -inset-8 rounded-full bg-primary-700/10 blur-3xl sm:-inset-10" />

            {/* FLOATING NOTE */}
            <div className="absolute -left-3 top-5 z-20 hidden w-44 -rotate-3 rounded-2xl border border-white/10 bg-[#211014]/90 p-3.5 shadow-2xl backdrop-blur-xl xl:block">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-900/50 text-primary-300">
                  <StickyNote size={13} />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-white/35">
                    Note
                  </p>
                  <p className="text-[9px] text-primary-300">24:18</p>
                </div>
              </div>

              <p className="mt-3 text-[10px] leading-5 text-white/70">
                Server components run on the server, reducing client-side
                JavaScript.
              </p>
            </div>

            {/* BROWSER */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#16080B]/95 shadow-2xl sm:rounded-[1.75rem]">
              <div className="flex h-9 items-center gap-1.5 border-b border-white/5 bg-white/2.5 px-3 sm:h-11 sm:gap-2 sm:px-4">
                <span className="h-2 w-2 rounded-full bg-red-400/50 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/50 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-green-400/50 sm:h-2.5 sm:w-2.5" />

                <div className="ml-2 flex h-5 min-w-0 flex-1 items-center rounded-md bg-white/4 px-2 sm:ml-4 sm:h-6 sm:px-3">
                  <span className="truncate text-[7px] text-white/20 sm:text-[8px]">
                    edutube.app/library/nextjs-course
                  </span>
                </div>
              </div>

              <div className="grid min-h-75 grid-cols-[48px_1fr] sm:min-h-105 sm:grid-cols-[70px_1fr] md:grid-cols-[90px_1fr]">
                {/* SIDEBAR */}
                <div className="border-r border-white/5 bg-white/1.5 p-2 sm:p-3">
                  <div className="mb-5 flex h-6 items-center justify-center rounded-lg bg-primary-600 sm:mb-7 sm:h-7">
                    <Play
                      size={9}
                      fill="white"
                      className="text-white sm:h-3 sm:w-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <MiniNav icon={<Library size={11} />} active />
                    <MiniNav icon={<StickyNote size={11} />} />
                    <MiniNav icon={<Sparkles size={11} />} />
                  </div>
                </div>

                {/* PREVIEW CONTENT */}
                <div className="min-w-0 p-3 sm:p-5 md:p-6">
                  <div className="mb-3 sm:mb-5">
                    <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-primary-400 sm:text-[8px]">
                      Study session
                    </p>

                    <p className="mt-1 truncate text-xs font-bold text-white sm:text-sm">
                      Next.js 16 Full Course
                    </p>
                  </div>

                  <div className="relative aspect-video overflow-hidden rounded-lg border border-white/5 bg-[#25090D] sm:rounded-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(220,38,38,.28),transparent_38%)]" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-900 shadow-xl sm:h-11 sm:w-11">
                        <Play
                          size={13}
                          fill="currentColor"
                          className="ml-0.5 sm:h-3.75 sm:w-3.75"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                      <div className="mb-1 flex justify-between text-[6px] text-white/40 sm:text-[7px]">
                        <span>24:18</span>
                        <span>1:42:30</span>
                      </div>

                      <div className="h-0.5 overflow-hidden rounded-full bg-white/10 sm:h-1">
                        <div className="h-full w-[24%] rounded-full bg-primary-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2">
                    <PreviewNote
                      time="24:18"
                      text="Server components run on the server."
                    />

                    <PreviewNote
                      time="31:42"
                      text="Use client only when interaction is required."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="absolute -bottom-5 -right-2 z-20 hidden w-44 rounded-2xl border border-white/10 bg-[#211014]/95 p-3.5 shadow-2xl backdrop-blur-xl sm:block md:-right-4 md:w-48 md:p-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-semibold text-white/50">
                  VIDEO PROGRESS
                </span>

                <TrendingBadge />
              </div>

              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-2xl font-extrabold text-white">
                  68%
                </span>

                <span className="mb-1 text-[8px] text-primary-400">
                  +12% this week
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-300">
                <div className="h-full w-[68%] rounded-full bg-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

function MiniNav({
  icon,
  active = false,
}: {
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-7 items-center justify-center rounded-lg ${
        active ? "bg-primary-900/40 text-primary-300" : "text-white/20"
      }`}
    >
      {icon}
    </div>
  );
}

function PreviewNote({ time, text }: { time: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/2.5 p-2.5">
      <div className="mb-1 flex items-center gap-1.5">
        <span className="rounded bg-primary-900/40 px-1 py-0.5 text-[7px] font-bold text-primary-300">
          {time}
        </span>

        <StickyNote size={9} className="text-white/20" />
      </div>

      <p className="line-clamp-2 text-[8px] leading-3.5 text-white/45">
        {text}
      </p>
    </div>
  );
}

function TrendingBadge() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded bg-primary-900/40 text-primary-400">
      <ArrowRight size={9} className="-rotate-45" />
    </span>
  );
}
