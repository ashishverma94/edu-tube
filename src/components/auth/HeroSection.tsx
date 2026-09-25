import {
  Play,
  Check,
  Timer,
  FileText,
  Sparkles,
  StickyNote,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative hidden h-screen overflow-hidden min-h-0 bg-[#24090E] lg:block">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 900 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroMaroon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#16080B" />

            <stop offset="48%" stopColor="#450A0A" />

            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          <linearGradient id="waveRed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#991B1B" stopOpacity="0" />

            <stop offset="50%" stopColor="#DC2626" stopOpacity=".55" />

            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="heroGlow">
            <stop offset="0%" stopColor="#F87171" stopOpacity=".25" />

            <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="900" height="1000" fill="url(#heroMaroon)" />

        <circle cx="680" cy="240" r="260" fill="url(#heroGlow)" />

        <circle cx="160" cy="800" r="240" fill="url(#heroGlow)" opacity=".5" />

        {/* Main organic waves */}

        <path
          d="M-100 740 C140 590 280 700 430 600 C600 485 680 520 1000 330"
          fill="none"
          stroke="url(#waveRed)"
          strokeWidth="2"
        />

        <path
          d="M-100 780 C120 630 300 760 470 640 C650 510 750 560 1000 390"
          fill="none"
          stroke="url(#waveRed)"
          strokeWidth="1"
          opacity=".55"
        />

        <path
          d="M-100 820 C120 680 310 790 500 680 C670 580 790 610 1000 460"
          fill="none"
          stroke="#FB7185"
          strokeWidth="1"
          opacity=".18"
        />

        {/* Orbit */}

        <ellipse
          cx="630"
          cy="360"
          rx="230"
          ry="120"
          fill="none"
          stroke="#FDA4AF"
          strokeWidth="1"
          opacity=".18"
          transform="rotate(-18 630 360)"
        />

        <ellipse
          cx="630"
          cy="360"
          rx="180"
          ry="85"
          fill="none"
          stroke="#FDA4AF"
          strokeWidth="1"
          opacity=".13"
          transform="rotate(-18 630 360)"
        />

        {/* Decorative dots */}

        <circle cx="820" cy="200" r="4" fill="#FCA5A5" />

        <circle cx="760" cy="520" r="3" fill="#FDA4AF" />

        <circle cx="480" cy="270" r="3" fill="#FCA5A5" />
      </svg>

      <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-12">
        {/* Center */}

        <div className="relative m-auto w-full max-w-xl">
          {/* Floating note */}

          <div className="absolute -right-4 bottom-24 z-10 hidden xl:block">
            <div className="w-48 rotate-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500/20 text-primary-300">
                  <StickyNote size={13} />
                </div>

                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
                  Quick note
                </span>
              </div>

              <p className="text-[11px] leading-5 text-white/75">
                Server components render on the server.
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-[9px] text-primary-300">
                <Timer size={10} />
                12:42
              </div>
            </div>
          </div>

          {/* Heading */}

          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-primary-400/60" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-300">
                Learn differently
              </span>
            </div>

            <h2 className="font-display text-4xl font-bold leading-[1.05] gap-1 tracking-wider text-white xl:text-5xl 2xl:text-6xl">
              Don't just
              <span className="text-primary-300"> watch.</span>
              <br />
              <span className="text-white/80">Understand.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-white/50 xl:text-base">
              EduTube transforms long educational videos into a personal study
              workspace where every idea, note and moment stays connected.
            </p>
          </div>

          {/* Features */}

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <HeroFeature
              icon={<StickyNote size={14} />}
              title="Timestamped notes"
              description="Capture ideas exactly when they happen."
            />

            <HeroFeature
              icon={<Timer size={14} />}
              title="Track progress"
              description="Pick up where you stopped."
            />

            <HeroFeature
              icon={<FileText size={14} />}
              title="Build your library"
              description="Keep every course together."
            />

            <HeroFeature
              icon={<Sparkles size={14} />}
              title="AI assisted"
              description="Turn notes into revision material."
            />
          </div>

          {/* Video preview */}

          <div className="relative mt-7">
            <div className="absolute -inset-3 rounded-3xl bg-primary-600/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur-xl">
              <div className="relative aspect-16/6 overflow-hidden bg-[#18070A]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(220,38,38,.22),transparent_35%)]" />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/30 px-2.5 py-1.5 backdrop-blur-md">
                  <div className="flex size-4 items-center justify-center rounded-[3px] bg-primary-600 shadow-maroon-sm">
                    <Play
                      size={7}
                      strokeWidth={2.5}
                      className="ml-0.5 fill-white text-white"
                    />
                  </div>

                  <span className="text-[8px] font-semibold text-white/60">
                    STUDY SESSION
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#450A0A] shadow-2xl">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <div className="mb-1.5 flex justify-between text-[8px] text-white/40">
                    <span>24:18</span>
                    <span>1:42:30</span>
                  </div>

                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[24%] rounded-full bg-primary-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 px-3.5 py-2.5">
                <div>
                  <p className="text-[10px] font-semibold text-white/75">
                    Next.js App Router Deep Dive
                  </p>

                  <p className="mt-0.5 text-[8px] text-white/30">
                    Continue your study session
                  </p>
                </div>

                <div className="rounded-lg bg-primary-500/10 px-2 py-1 text-[9px] font-bold text-primary-300">
                  24%
                </div>
              </div>
            </div>
          </div>
          {/* Bottom */}

          <div className="flex mt-2 items-center gap-2 text-[10px] text-white/50">
            <Check size={12} className="text-primary-400" />
            Built for focused learning
            <span>•</span>
            Your notes stay yours
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

function HeroFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.035] p-2.5 transition-all hover:border-primary-400/20 hover:bg-white/6">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-semibold text-white/75">{title}</p>

        <p className="mt-0.5 text-[8px] leading-3.5 text-white/30">
          {description}
        </p>
      </div>
    </div>
  );
}
