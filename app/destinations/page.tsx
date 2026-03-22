import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp } from "lucide-react";
import { getCountries } from "@/lib/countries";

export default async function DestinationsPage() {
  const countries = await getCountries();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <section className="container section-y">
          <h1 className="mb-2 text-3xl font-bold text-[#1F2937] md:text-4xl">
            All Destinations
          </h1>
          <p className="mb-10 text-[#6B7280]">
            Explore visa options for our most popular destinations.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={`/${country.slug}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-4 p-6">
                  <Image
                    src={`https://flagcdn.com/w80/${country.flagCode}.png`}
                    alt=""
                    width={56}
                    height={40}
                    className="shrink-0 rounded-md border border-gray-200 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-[#1F2937]">
                      {country.name}
                    </h2>
                    <div className="mt-2 flex items-center gap-4 text-sm text-[#6B7280]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        {country.processingTime}
                      </span>
                      <span className="flex items-center gap-1.5 text-primary">
                        <TrendingUp className="size-4" />
                        {country.successRate}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-primary">
                      {country.startingPrice}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
