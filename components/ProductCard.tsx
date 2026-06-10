"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Product, formatMAD } from "@/lib/products";

const SWIPE_THRESHOLD = 45;

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.oldPrice && product.oldPrice > product.price;
  const media = product.media;
  const [index, setIndex] = useState(0);

  const drag = useRef({ x: 0, dx: 0, active: false, moved: false });
  const [offset, setOffset] = useState(0);

  const count = media.length;
  const single = count <= 1;

  function clamp(i: number) {
    return Math.max(0, Math.min(count - 1, i));
  }

  function down(e: React.PointerEvent) {
    if (single) return;
    drag.current = { x: e.clientX, dx: 0, active: true, moved: false };
  }
  function move(e: React.PointerEvent) {
    if (!drag.current.active) return;
    drag.current.dx = e.clientX - drag.current.x;
    if (Math.abs(drag.current.dx) > 6) drag.current.moved = true;
    setOffset(drag.current.dx);
  }
  function up() {
    if (!drag.current.active) return;
    const dx = drag.current.dx;
    drag.current.active = false;
    setOffset(0);
    if (dx <= -SWIPE_THRESHOLD) setIndex((i) => clamp(i + 1));
    else if (dx >= SWIPE_THRESHOLD) setIndex((i) => clamp(i - 1));
  }
  // Empêche la navigation si l'utilisateur vient de swiper
  function guardClick(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      drag.current.moved = false;
    }
  }

  return (
    <div className="group flex flex-col">
      {/* Galerie défilable */}
      <Link
        href={`/products/${product.slug}`}
        onClick={guardClick}
        aria-label={product.name}
        className="relative block overflow-hidden rounded-2xl bg-cream"
      >
        {onSale && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-burgundy px-3 py-1 font-body text-[0.6rem] uppercase tracking-[0.2em] text-ivory">
            Promo
          </span>
        )}
        {!single && (
          <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-ink/55 px-2.5 py-1 font-body text-[0.6rem] uppercase tracking-[0.16em] text-ivory backdrop-blur">
            {hasVid(media) && <PlayDot />}
            {count}
          </span>
        )}

        <div
          className="flex touch-pan-y"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${offset}px))`,
            transition: drag.current.active
              ? "none"
              : "transform 400ms cubic-bezier(0.16,1,0.3,1)",
          }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={up}
        >
          {media.map((m, i) => {
            const src = m.type === "image" ? m.url : m.poster;
            return (
              <div key={i} className="aspect-[4/5] w-full shrink-0 grow-0 basis-full">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`${product.name} — ${i + 1}`}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-ink" />
                )}
              </div>
            );
          })}
        </div>

        {!single && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {media.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-ivory" : "w-1.5 bg-ivory/60"
                }`}
              />
            ))}
          </div>
        )}
      </Link>

      <Link href={`/products/${product.slug}`} className="mt-4 flex flex-col gap-1">
        <p className="eyebrow">{product.category}</p>
        <h3 className="font-display text-xl font-medium text-ink transition group-hover:text-burgundy">
          {product.name}
        </h3>
        <p className="line-clamp-2 font-body text-sm leading-relaxed text-stone">
          {product.description}
        </p>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-body text-base text-ink">{formatMAD(product.price)}</span>
          {onSale && (
            <span className="font-body text-sm text-stone/60 line-through">
              {formatMAD(product.oldPrice!)}
            </span>
          )}
        </div>
        <span className="mt-3 font-body text-xs uppercase tracking-[0.18em] text-burgundy opacity-0 transition group-hover:opacity-100">
          Commander →
        </span>
      </Link>
    </div>
  );
}

function hasVid(media: Product["media"]) {
  return media.some((m) => m.type === "video");
}

function PlayDot() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
