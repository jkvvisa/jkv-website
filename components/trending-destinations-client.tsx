"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronDown, Clock, TrendingUp } from "lucide-react";
import {
  EMBLA_AUTOPLAY_INTERVAL_MS,
  EmblaCarouselDots,
  EmblaCarouselPrevNext,
  useEmblaAutoplay,
} from "@/components/embla-carousel-ui";
import { Card, CardContent } from "@/components/ui/card";

export interface TrendingDestinationItem {
  slug: string;
  name: string;
  flagCode: string;
  startingPrice: string;
  processingTime: string;
  successRate: string;
  cardImage: string;
}

function TrendingDestinationCard({ item }: { item: TrendingDestinationItem }) {
  return (
    <Link href={`/${item.slug}`}>
      <Card className="group flex flex-col overflow-hidden border-0 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
          <Image
            src={item.cardImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
            aria-hidden
          />
          <div className="absolute left-3 top-3 z-10 rounded-lg border-2 border-white bg-white/95 p-0.5 shadow-md">
            <Image
              src={`https://flagcdn.com/w80/${item.flagCode}.png`}
              alt={`${item.name} flag`}
              width={56}
              height={42}
              className="rounded-md object-cover"
            />
          </div>
          <span className="absolute right-3 top-3 z-10 rounded-full bg-background/90 px-4 py-2 text-base font-medium shadow-sm backdrop-blur-sm">
            {item.startingPrice}
          </span>
        </div>
        <CardContent className="pt-4">
          <h3 className="text-2xl font-bold text-[#1A2C42]">{item.name}</h3>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-base font-normal text-[#6C7B8A]">
              <Clock className="size-4 shrink-0 text-[#6C7B8A]" aria-hidden />
              {item.processingTime}
            </span>
            <span className="flex items-center gap-1.5 text-base font-normal text-[#fb923c]">
              <TrendingUp className="size-4 shrink-0 text-[#fb923c]" aria-hidden />
              {item.successRate}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TrendingMobileCarouselSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-transparent">
      <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="mt-4 space-y-2 px-0.5">
        <div className="h-7 w-2/3 animate-pulse rounded-md bg-muted/50" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted/40" />
      </div>
    </div>
  );
}

function TrendingMobileCarousel({ items }: { items: TrendingDestinationItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: items.length > 1,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  useEmblaAutoplay(emblaApi, EMBLA_AUTOPLAY_INTERVAL_MS, items.length > 1);

  if (!items.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div key={item.slug} className="relative min-w-0 flex-[0_0_100%]">
              <TrendingDestinationCard item={item} />
            </div>
          ))}
        </div>
      </div>
      <EmblaCarouselPrevNext
        show={items.length > 1}
        onPrev={scrollPrev}
        onNext={scrollNext}
        prevAriaLabel="Previous destination"
        nextAriaLabel="Next destination"
      />
      <EmblaCarouselDots
        count={items.length}
        selectedIndex={selectedIndex}
        onDotClick={(i) => emblaApi?.scrollTo(i)}
        variant="surface"
        layout="below"
        ariaLabelPrefix="Go to destination"
      />
    </div>
  );
}

/** Omit `display` here so `hidden` / `max-md:hidden` / `md:hidden` are not overridden by `inline-flex`. */
const viewAllLinkClass =
  "items-center justify-center gap-1 text-sm font-medium text-primary hover:underline";

export function TrendingDestinationsClient({ items }: { items: TrendingDestinationItem[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="trending-title" className="text-2xl font-bold text-[#1C2B3A] md:text-3xl">
            Top Hotspot Destinations
          </h2>
          <p className="mt-1 text-[#6B7280]">
            Explore the most popular destinations for travelers right now.
          </p>
        </div>
        <Link
          href="/destinations"
          className={`inline-flex shrink-0 ${viewAllLinkClass} max-md:hidden`}
        >
          View all
          <ChevronDown className="size-4 rotate-[-90deg]" aria-hidden />
        </Link>
      </div>

      <div className="md:hidden">
        {!mounted ? <TrendingMobileCarouselSkeleton /> : <TrendingMobileCarousel items={items} />}
      </div>

      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TrendingDestinationCard key={item.slug} item={item} />
        ))}
      </div>

      <div className="mt-6 flex justify-center md:hidden">
        <Link href="/destinations" className={`inline-flex ${viewAllLinkClass}`}>
          View all
          <ChevronDown className="size-4 rotate-[-90deg]" aria-hidden />
        </Link>
      </div>
    </>
  );
}
