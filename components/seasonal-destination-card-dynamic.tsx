"use client";

import { useState, useEffect } from "react";
import type { CountryVisaData } from "@/lib/country-data";
import { SeasonalDestinationCard } from "@/components/seasonal-destination-card";

function SeasonalCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-[#f3f6f9] shadow-lg">
      <div className="aspect-[2/1] w-full animate-pulse bg-muted/60 md:aspect-[16/9]" />
      <div className="p-3 md:p-4">
        <div className="h-5 w-36 animate-pulse rounded-md bg-muted/60 md:h-6 md:w-44" />
        <div className="mt-1.5 h-3 w-24 animate-pulse rounded-md bg-muted/40 md:mt-2 md:h-3.5 md:w-28" />
      </div>
    </div>
  );
}

/**
 * Renders the carousel only after mount so server HTML and the first client paint match
 * (avoids Embla DOM changes vs SSR and avoids next/dynamic + ssr:false hydration races).
 */
export function SeasonalDestinationCardDynamic({
  countries,
}: {
  countries: CountryVisaData[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SeasonalCardSkeleton />;
  }

  return <SeasonalDestinationCard countries={countries} />;
}
