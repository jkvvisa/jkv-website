import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CountryBanner } from "@/components/country-banner";
import { CountryFAQ } from "@/components/country-faq";
import { ApplyVisaButton } from "@/components/apply-visa-button";
import { AnimateInView } from "@/components/animate-in-view";
import { getCountryFAQs } from "@/lib/faq-data";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  Timer,
  Building2,
  IdCard,
  Camera,
  FolderOpen,
  Plane,
  Hotel,
  Briefcase,
  ChevronRight,
  Shield,
  Landmark,
  Sparkles,
} from "lucide-react";
import { getCountryBySlug, getCountrySlugs, getCountries } from "@/lib/countries";
import { notFound } from "next/navigation";

interface CountryPageProps {
  params: Promise<{ countries: string }>;
}

export async function generateStaticParams() {
  const slugs = await getCountrySlugs();
  return slugs.map((slug) => ({ countries: slug }));
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  passport: IdCard,
  camera: Camera,
  folder: FolderOpen,
  plane: Plane,
  hotel: Hotel,
  briefcase: Briefcase,
};

export default async function CountryPage({ params }: CountryPageProps) {
  const { countries } = await params;
  const slug = countries.toLowerCase();
  const [data, allCountries] = await Promise.all([
    getCountryBySlug(slug),
    getCountries(),
  ]);
  if (!data) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        preselectedCountryId={data.id ?? data.slug}
        countries={allCountries}
      />
      <main>
        {/* Hero Banner */}
        <CountryBanner images={data.bannerImages ?? []}>
          <div className="mb-6 flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-300"
            >
              Destinations
            </Link>
            <span className="text-gray-500">&gt;</span>
            <span className="text-white font-medium">{data.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Visa for {data.name}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                <DollarSign className="size-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-white">{data.startingPrice}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                <Clock className="size-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-white">{data.processingTime}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                <CheckCircle className="size-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-white">{data.successRate}</span>
            </div>
          </div>
        </CountryBanner>

        {/* Visa Information */}
        <section className="container section-y">
          <AnimateInView animation="fade-in-up">
          <h2 className="mb-8 flex items-center gap-3">
            <Image
              src={`https://flagcdn.com/w80/${data.flagCode}.png`}
              alt=""
              width={56}
              height={40}
              className="shrink-0 rounded-md border border-gray-200 object-cover shadow-sm"
            />
            <span className="text-3xl font-bold text-[#1F2937] md:text-4xl">
              {data.name} Visa Information
            </span>
          </h2>
          </AnimateInView>
          <div className="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative flex gap-4 rounded-lg bg-gray-50/50 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                <FileText className="size-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Visa Type:</p>
                <p className="font-semibold text-[#1F2937]">{data.visaInfo.visaType}</p>
              </div>
            </div>
            <div className="relative flex gap-4 rounded-lg bg-gray-50/50 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Calendar className="size-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Length of Stay:</p>
                <p className="font-semibold text-[#1F2937]">{data.visaInfo.lengthOfStay}</p>
              </div>
            </div>
            <div className="relative flex gap-4 rounded-lg bg-gray-50/50 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Timer className="size-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Validity:</p>
                <p className="font-semibold text-[#1F2937]">{data.visaInfo.validity}</p>
              </div>
            </div>
            <div className="relative flex gap-4 rounded-lg bg-gray-50/50 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Building2 className="size-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Entry:</p>
                <p className="font-semibold text-[#1F2937]">{data.visaInfo.entry}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Hotspot Destinations */}
        <section className="bg-gray-50 section-y">
          <div className="container">
            <AnimateInView animation="fade-in-up">
              <h2 className="mb-4 text-center text-3xl font-bold text-[#1F2937] md:text-4xl">
                Top Hotspot Destinations
              </h2>
              <p className="mb-10 text-center text-[#6B7280] max-w-2xl mx-auto">
                {data.destinationsIntro}
              </p>
            </AnimateInView>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.destinations.map((dest, i) => (
                <AnimateInView key={dest.name} animation="fade-in-up" delay={(i + 1) * 100}>
                <div
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#1F2937]">{dest.name}</h3>
                    <p className="mt-2 text-sm text-[#6B7280]">{dest.description}</p>
                    <Link
                      href={dest.href}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Learn more
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
                </AnimateInView>
              ))}
            </div>
          </div>
        </section>

        {/* Documents Required */}
        <section className="bg-gray-100 section-y">
          <div className="container">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-8 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <FileText className="size-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-[#1F2937] md:text-3xl">
                  Documents Required
                </span>
              </h2>
              <div className="grid gap-6 pb-8 sm:grid-cols-2">
                {data.documents.map((doc) => {
                  const IconComponent = iconMap[doc.icon] || FileText;
                  return (
                    <div
                      key={doc.title}
                      className="flex gap-4 rounded-lg bg-gray-100 px-6 py-8"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <IconComponent className="size-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#1F2937] md:text-lg">
                          {doc.title}
                        </h3>
                        <p className="mt-2 text-sm font-normal text-[#6B7280]">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <CountryFAQ faqs={getCountryFAQs(data.name)} countryName={data.name} />

        {/* Visa Fees Breakdown */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white section-y">
          <div className="container">
            <AnimateInView animation="fade-in-up">
              <div className="mx-auto max-w-2xl">
                {/* Header with trust badge */}
                <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1F2937] md:text-3xl">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <DollarSign className="size-6 text-primary" />
                    </div>
                    Visa Fees Breakdown
                  </h2>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                    <Shield className="size-4" />
                    Transparent pricing · No hidden fees
                  </span>
                </div>

                {/* Pricing card */}
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                  {/* Fee rows */}
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center justify-between px-6 py-5 sm:px-8">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50">
                          <Landmark className="size-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1F2937]">Embassy Fee (Official)</p>
                          <p className="text-sm text-[#6B7280]">Government consular charges</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold tabular-nums text-[#1F2937]">{data.embassyFee}</span>
                    </div>
                    <div className="flex items-center justify-between px-6 py-5 sm:px-8">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <Sparkles className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1F2937]">JKV VisaXpress Service Fee</p>
                          <p className="text-sm text-[#6B7280]">Document handling & expert support</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold tabular-nums text-[#1F2937]">{data.serviceFee}</span>
                    </div>
                  </div>

                  {/* Total highlight */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-6 sm:px-8">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#1F2937]">Total Cost</span>
                      <span className="text-2xl font-bold tabular-nums text-primary md:text-3xl">{data.totalCost}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#6B7280]">All-inclusive · Pay once, no surprises</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col items-center gap-4">
                  <ApplyVisaButton
                    countryId={data.id}
                    countrySlug={data.slug}
                    countries={allCountries}
                  />
                  <p className="text-center text-sm text-[#6B7280]">
                    {data.processingTime} processing · {data.successRate}
                  </p>
                </div>
              </div>
            </AnimateInView>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
