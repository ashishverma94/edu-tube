import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, BookOpen, Check } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,.18),transparent_45%)]" />

      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-700/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-24 lg:py-32">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-700/40 bg-primary-900/30 text-primary-300 shadow-lg shadow-primary-950/20">
          <BookOpen size={24} />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-400">
          Start learning differently
        </p>

        <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Don't let your next
          <span className="text-primary-400"> great idea </span>
          disappear inside a video.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Save the video. Capture the important moments. Build notes you can
          actually come back to.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/library">
            <Button
              variant="primary"
              size="lg"
              className="h-12 w-full px-6 sm:w-auto"
            >
              Start learning for free
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-muted">
          <span className="flex items-center gap-1.5">
            <Check size={11} className="text-primary-400" />
            Timestamped notes
          </span>

          <span className="flex items-center gap-1.5">
            <Check size={11} className="text-primary-400" />
            Progress tracking
          </span>

          <span className="flex items-center gap-1.5">
            <Check size={11} className="text-primary-400" />
            Built for focused learning
          </span>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
