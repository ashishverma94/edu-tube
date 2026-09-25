"use client";

import Image from "next/image";
import remarkGfm from "remark-gfm";
import Logo from "@/assets/logo.png";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { AIChatMessage } from "@/lib/aiApi";
import { Bot, Send, Sparkles, RefreshCw } from "lucide-react";

interface AIStudyAssistantProps {
  messages: AIChatMessage[];
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onAsk: (question?: string) => void;
  onClear: () => void;
}

const QUICK_PROMPTS = [
  "Summarize my notes",
  "What are the key concepts?",
  "Explain these notes simply",
  "What should I remember?",
];

export default function AIStudyAssistant({
  messages,
  input,
  loading,
  onInputChange,
  onAsk,
  onClear,
}: AIStudyAssistantProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);
  return (
    <div className="flex h-[calc(100vh-7rem)] min-h-155 max-h-212 flex-col overflow-hidden rounded-2xl border border-primary-900/50 bg-card shadow-card">
      <div className="shrink-0 border-b border-border bg-primary-950/20 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-900/50 text-primary-300">
              <Sparkles size={17} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-white">
                AI Study Assistant
              </h2>

              <p className="text-[10px] text-muted">
                Ask questions about your notes
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              disabled={loading}
              className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-surface hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto p-4 scroll"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-900/30 text-primary-400">
              <Image
                src={Logo}
                alt="edutube-logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            <h3 className="mt-4 text-sm font-bold text-white">Study with AI</h3>

            <p className="mt-2 max-w-65 text-[11px] leading-5 text-muted">
              Ask questions about your notes, request a summary, or ask the AI
              to explain a concept.
            </p>

            <div className="mt-5 flex w-full flex-col gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onAsk(prompt)}
                  disabled={loading}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-left text-[11px] text-muted transition hover:border-primary-800/60 hover:bg-primary-950/20 hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="mr-2 text-primary-400">✦</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex w-full ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {isUser ? (
                    <div className="w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary-600 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                      <p className="whitespace-pre-wrap wrap-break-words">
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <div className="flex w-full max-w-[95%] items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-900/50 text-primary-300">
                        <Bot size={13} />
                      </div>

                      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border bg-background px-4 py-3">
                        <div className="ai-markdown">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex w-full justify-start">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-900/50 text-primary-300">
                    <Bot size={13} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md border border-border bg-background px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" />

                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400"
                        style={{ animationDelay: "100ms" }}
                      />

                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400"
                        style={{ animationDelay: "200ms" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (!loading && input.trim()) {
            onAsk();
          }
        }}
        className="shrink-0 border-t border-border bg-card p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 transition focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-900/30">
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                if (!loading && input.trim()) {
                  onAsk();
                }
              }
            }}
            disabled={loading}
            rows={2}
            maxLength={2000}
            placeholder="Ask something about your notes..."
            className="max-h-28 min-h-10.5 flex-1 resize-none overflow-y-auto bg-transparent px-1 py-1 text-xs leading-5 text-foreground outline-none placeholder:text-muted disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Ask AI"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 px-1">
          <span className="text-[9px] text-muted">
            Enter to send · Shift + Enter for new line
          </span>

          <span className="shrink-0 text-[9px] text-muted">
            {input.length}/2000
          </span>
        </div>
      </form>
    </div>
  );
}
