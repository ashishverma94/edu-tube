"use client";
import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { ChevronDown } from "lucide-react";

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is EduTube?",
      answer:
        "EduTube turns educational YouTube videos into focused study sessions. You can save videos, create timestamped notes, track your progress, and return to important moments without searching through the entire video again.",
    },
    {
      question: "Can I add notes to a specific timestamp?",
      answer:
        "Yes. Notes are connected to the exact point in the video where you created them. When you return to a note, you can jump directly back to that moment.",
    },
    {
      question: "Does EduTube track my video progress?",
      answer:
        "Yes. Your learning progress is tracked so you can continue from where you stopped and quickly understand how much of a video you have completed.",
    },
    {
      question: "Can I edit or delete my notes?",
      answer:
        "Yes. You can edit the note text and timestamp or delete notes whenever you need to keep your study material organized.",
    },
    {
      question: "Is AI available in EduTube?",
      answer:
        "AI-powered revision features are planned for EduTube. These features will help turn your notes into summaries and revision material.",
    },
    {
      question: "Is EduTube free?",
      answer:
        "EduTube is designed to be free to start. Additional features may be introduced as the platform evolves.",
    },
  ];
  return (
    <section id="faq">
      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered."
          description="Everything you need to know about the EduTube learning experience."
        />

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-primary-800/60 bg-card"
                    : "border-border bg-card/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-muted transition-transform ${
                      isOpen ? "rotate-180 text-primary-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6">
                    <p className="text-sm leading-7 text-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
