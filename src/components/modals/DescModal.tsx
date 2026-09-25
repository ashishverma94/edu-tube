"use client";

import { X } from "lucide-react";

interface DescriptionModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

export function DescriptionModal({
  title,
  description,
  onClose,
}: DescriptionModalProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">
              Description
            </p>

            <h2 className="mt-1 truncate text-base font-bold text-foreground">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto scroll px-5 py-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted">
            {description}
          </p>
        </div>

        <div className="flex justify-end border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}