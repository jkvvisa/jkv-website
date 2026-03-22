"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EmblaCarouselType } from "embla-carousel";

/** Shared with seasonal + trending carousels */
export const EMBLA_AUTOPLAY_INTERVAL_MS = 4000;

export const emblaNavButtonClass =
  "rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/60 md:p-2";

export const emblaNavButtonPositionClass = "absolute top-1/2 z-10 -translate-y-1/2";

type EmblaCarouselDotsVariant = "overlay" | "surface";

function dotClasses(selected: boolean, variant: EmblaCarouselDotsVariant) {
  if (variant === "overlay") {
    return selected
      ? "w-4 bg-white"
      : "w-1.5 bg-white/60 hover:bg-white/80";
  }
  return selected ? "w-4 bg-primary" : "w-1.5 bg-gray-300 hover:bg-gray-400";
}

export function EmblaCarouselDots({
  count,
  selectedIndex,
  onDotClick,
  variant = "surface",
  layout = "below",
  ariaLabelPrefix = "Go to slide",
}: {
  count: number;
  selectedIndex: number;
  onDotClick: (index: number) => void;
  variant?: EmblaCarouselDotsVariant;
  /** `below` = under the viewport; `overlay` = bottom-center on the slide (e.g. on image) */
  layout?: "below" | "overlay";
  ariaLabelPrefix?: string;
}) {
  if (count <= 1) return null;

  const trackClass =
    layout === "overlay"
      ? "absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-3"
      : "mt-3 flex justify-center gap-1.5";

  return (
    <div className={trackClass} role="group" aria-label="Carousel pagination">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${ariaLabelPrefix} ${i + 1} of ${count}`}
          onClick={() => onDotClick(i)}
          className={`h-1.5 rounded-full transition-all ${dotClasses(i === selectedIndex, variant)}`}
        />
      ))}
    </div>
  );
}

export function EmblaCarouselPrevNext({
  onPrev,
  onNext,
  show,
  prevAriaLabel = "Previous slide",
  nextAriaLabel = "Next slide",
}: {
  onPrev: () => void;
  onNext: () => void;
  show: boolean;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
}) {
  if (!show) return null;
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        className={`${emblaNavButtonPositionClass} left-2 ${emblaNavButtonClass}`}
        aria-label={prevAriaLabel}
      >
        <ChevronLeft className="size-4 md:size-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`${emblaNavButtonPositionClass} right-2 ${emblaNavButtonClass}`}
        aria-label={nextAriaLabel}
      >
        <ChevronRight className="size-4 md:size-5" aria-hidden />
      </button>
    </>
  );
}

export function useEmblaAutoplay(
  emblaApi: EmblaCarouselType | undefined,
  intervalMs: number,
  enabled: boolean
) {
  useEffect(() => {
    if (!emblaApi || !enabled) return;
    const interval = setInterval(() => emblaApi.scrollNext(), intervalMs);
    return () => clearInterval(interval);
  }, [emblaApi, intervalMs, enabled]);
}
