import { AnimateInView } from "@/components/animate-in-view";
import {
  TrendingDestinationsClient,
  type TrendingDestinationItem,
} from "@/components/trending-destinations-client";
import { getCountries, pickTrendingCardImage } from "@/lib/countries";

const TOP_DESTINATIONS_LIMIT = 6;

export async function TrendingDestinations() {
  const allCountries = await getCountries();
  const countries = allCountries.slice(0, TOP_DESTINATIONS_LIMIT);

  const items: TrendingDestinationItem[] = countries.map((country) => ({
    slug: country.slug,
    name: country.name,
    flagCode: country.flagCode,
    startingPrice: country.startingPrice,
    processingTime: country.processingTime,
    successRate: country.successRate,
    cardImage: pickTrendingCardImage(country),
  }));

  return (
    <section className="container section-y" aria-labelledby="trending-title">
      <AnimateInView animation="fade-in-up">
        <TrendingDestinationsClient items={items} />
      </AnimateInView>
    </section>
  );
}
