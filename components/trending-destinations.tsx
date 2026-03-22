import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateInView } from "@/components/animate-in-view";
import { getCountries, pickTrendingCardImage } from "@/lib/countries";

const TOP_DESTINATIONS_LIMIT = 6;

export async function TrendingDestinations() {
  const allCountries = await getCountries();
  const countries = allCountries.slice(0, TOP_DESTINATIONS_LIMIT);
  return (
    <section
      className="container py-16"
      aria-labelledby="trending-title"
    >
      <AnimateInView animation="fade-in-up">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
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
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ChevronDown className="size-4 rotate-[-90deg]" aria-hidden />
          </Link>
        </div>
      </AnimateInView>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => {
          const cardImage = pickTrendingCardImage(country);
          return (
          <Link key={country.slug} href={`/${country.slug}`}>
            <Card className="group flex flex-col overflow-hidden border-0 transition-shadow hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
                <Image
                  src={cardImage}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                  aria-hidden
                />
                <div className="absolute left-3 top-3 z-10 rounded-lg border-2 border-white bg-white/95 p-0.5 shadow-md">
                  <Image
                    src={`https://flagcdn.com/w80/${country.flagCode}.png`}
                    alt={`${country.name} flag`}
                    width={56}
                    height={42}
                    className="rounded-md object-cover"
                  />
                </div>
                <span className="absolute right-3 top-3 z-10 rounded-full bg-background/90 px-4 py-2 text-base font-medium shadow-sm backdrop-blur-sm">
                  {country.startingPrice}
                </span>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-2xl font-bold text-[#1A2C42]">{country.name}</h3>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-base font-normal text-[#6C7B8A]">
                    <Clock className="size-4 shrink-0 text-[#6C7B8A]" aria-hidden />
                    {country.processingTime}
                  </span>
                  <span className="flex items-center gap-1.5 text-base font-normal text-[#fb923c]">
                    <TrendingUp className="size-4 shrink-0 text-[#fb923c]" aria-hidden />
                    {country.successRate}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
