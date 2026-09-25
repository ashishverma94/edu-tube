import { Play, StickyNote, Timer } from "lucide-react";
import SectionHeading from "./SectionHeading";

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Turn watching into learning."
          description="A simple workflow designed around the moments that actually matter."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          <ValueCard
            number="01"
            icon={<Play size={19} />}
            title="Add a video"
            description="Save an educational YouTube video and turn it into your own study session."
          />

          <ValueCard
            number="02"
            icon={<StickyNote size={19} />}
            title="Capture ideas"
            description="Create notes at exact timestamps so important concepts are never lost."
          />

          <ValueCard
            number="03"
            icon={<Timer size={19} />}
            title="Keep progressing"
            description="Track your progress and return to exactly where you stopped."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

function ValueCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-border-hover hover:shadow-card-hover sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900/30 text-primary-400">
          {icon}
        </div>

        <span className="font-mono text-[10px] font-bold text-white/15">
          {number}
        </span>
      </div>

      <h3 className="mt-6 font-display text-base font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
    </div>
  );
}
