"use client";

import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  playerReady: boolean;
}

export function VideoPlayer({
  playerReady,
}: VideoPlayerProps) {
  return (
    <div className="relative overflow-hidden 2xl:h-[80vh] rounded-2xl border border-border bg-black shadow-card">
      <div className="aspect-video w-full">
        <div
          id="youtube-player"
          className="h-full w-full"
        />
      </div>

      {!playerReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-xs text-white">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading video...
          </div>
        </div>
      )}
    </div>
  );
}