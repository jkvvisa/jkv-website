"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { CountryVisaData } from "@/lib/country-data";

function getSeasonName() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

interface SeasonalDestinationCardProps {
  countries: CountryVisaData[];
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop";

export function SeasonalDestinationCard({ countries }: SeasonalDestinationCardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [seasonName, setSeasonName] = useState("Season");

  useEffect(() => {
    setSeasonName(getSeasonName());
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || countries.length <= 1) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi, countries.length]);

  if (!countries.length) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#f3f6f9] shadow-lg">
      <div className="absolute right-0 top-0 z-10 flex flex-col items-center justify-center rounded-bl-xl bg-primary px-3 py-1.5 text-center shadow-md md:px-5 md:py-3">
        <span className="text-[11px] font-semibold leading-tight text-primary-foreground md:text-xs">
          Most Visited
        </span>
        <span className="text-[10px] leading-tight text-primary-foreground/90">
          This {seasonName}
        </span>
      </div>

      {/* 2:1 is clearly shorter than the old 4/3 hero (~33% less image height at the same width). */}
      <div className="relative w-full">
        <div
          className="relative aspect-[2/1] w-full overflow-hidden md:aspect-[16/9]"
          ref={emblaRef}
        >
          <div className="flex h-full">
            {countries.map((country) => (
              <div
                key={country.slug}
                className="relative min-w-0 flex-[0_0_100%]"
              >
                <Link href={`/${country.slug}`} className="block h-full">
                  <div className="absolute left-3 top-3 z-10 rounded-lg border-2 border-white shadow-md md:left-4 md:top-4">
                    <Image
                      src={`https://flagcdn.com/w80/${country.flagCode}.png`}
                      alt=""
                      width={56}
                      height={42}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="relative h-full w-full">
                    <Image
                      src={
                        country.destinations?.[0]?.image ?? DEFAULT_IMAGE
                      }
                      alt={
                        country.destinations?.[0]?.name ?? country.name
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {countries.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/60 md:p-2"
              aria-label="Previous country"
            >
              <ChevronLeft className="size-4 md:size-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/60 md:p-2"
              aria-label="Next country"
            >
              <ChevronRight className="size-4 md:size-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-3">
              {countries.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selectedIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`Go to country ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3 md:p-4">
        <h3 className="text-base font-bold text-[#1F2937] md:text-lg">
          {countries[selectedIndex]?.name}
        </h3>
        <Link
          href={`/${countries[selectedIndex]?.slug ?? "#"}`}
          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View visa details
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
