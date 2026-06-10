"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/products";

// Galerie produit défilable :
//  • Swipe au doigt sur mobile, glisser-déposer à la souris sur ordinateur
//  • Flèches précédent / suivant
//  • Pastilles + miniatures
//  • Prise en charge des vidéos (lecteur natif avec poster)

const SWIPE_THRESHOLD = 50; // px

export default function ProductGallery({
  media,
  alt,
}: {
  media: MediaItem[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const count = media.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, dx: 0, dragging: false });
  const [dragOffset, setDragOffset] = useState(0);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(count - 1, i)),
    [count]
  );

  const go = useCallback((i: number) => setIndex(clamp(i)), [clamp]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Pause any playing video when the slide changes.
  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.querySelectorAll("video").forEach((v) => v.pause());
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // ---- Pointer / touch drag handling ----
  function onPointerDown(e: React.PointerEvent) {
    // ignore drags that start on the native video controls
    if ((e.target as HTMLElement).closest("video")) return;
    drag.current = { startX: e.clientX, dx: 0, dragging: true };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.dragging) return;
    drag.current.dx = e.clientX - drag.current.startX;
    setDragOffset(drag.current.dx);
  }
  function endDrag() {
    if (!drag.current.dragging) return;
    const dx = drag.current.dx;
    drag.current.dragging = false;
    setDragOffset(0);
    if (dx <= -SWIPE_THRESHOLD) next();
    else if (dx >= SWIPE_THRESHOLD) prev();
  }

  const single = count <= 1;

  return (
    <div className="select-none">
      {/* Stage */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-champagne/40 bg-cream shadow-[0_30px_80px_-50px_rgba(92,20,24,0.4)]">
        <div
          ref={trackRef}
          className="flex touch-pan-y"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
            transition: drag.current.dragging
              ? "none"
              : "transform 450ms cubic-bezier(0.16,1,0.3,1)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {media.map((m, i) => (
            <div key={i} className="aspect-[4/5] w-full shrink-0 grow-0 basis-full">
              {m.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.url}
                  alt={`${alt} — vue ${i + 1}`}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={m.url}
                  poster={m.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full bg-ink object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Arrows */}
        {!single && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/50 bg-ivory/85 text-burgundy backdrop-blur transition hover:bg-ivory disabled:pointer-events-none disabled:opacity-0 md:opacity-0 md:group-hover:opacity-100"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index === count - 1}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/50 bg-ivory/85 text-burgundy backdrop-blur transition hover:bg-ivory disabled:pointer-events-none disabled:opacity-0 md:opacity-0 md:group-hover:opacity-100"
            >
              <Chevron dir="right" />
            </button>

            {/* Counter */}
            <span className="absolute right-4 top-4 z-10 rounded-full bg-burgundy/85 px-3 py-1 font-body text-[0.65rem] uppercase tracking-[0.18em] text-ivory backdrop-blur">
              {index + 1} / {count}
            </span>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {media.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Aller à l'image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-ivory"
                      : "w-1.5 bg-ivory/55 hover:bg-ivory/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {!single && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {media.map((m, i) => {
            const thumb = m.type === "image" ? m.url : m.poster;
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Vue ${i + 1}`}
                className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition ${
                  i === index
                    ? "border-burgundy"
                    : "border-champagne/30 opacity-70 hover:opacity-100"
                }`}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-ink text-ivory">
                    <PlayIcon />
                  </span>
                )}
                {m.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/30 text-ivory">
                    <PlayIcon />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
