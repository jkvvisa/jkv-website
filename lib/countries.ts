import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import {
  type CountryVisaData,
  type VisaInfo,
  type Destination,
  type Document,
} from "@/lib/country-data";

const DEFAULT_PROCESSING_TIME = "5-7 Business Days";
const DEFAULT_SUCCESS_RATE = "99% Success Rate";
const DEFAULT_DESTINATIONS_INTRO =
  "Get inspired for your upcoming journey with these must-visit locations.";
const DEFAULT_VISA_INFO: VisaInfo = {
  visaType: "Sticker",
  lengthOfStay: "Upto 30 days",
  validity: "Upto 90 days",
  entry: "Single",
};
const DEFAULT_DOCUMENTS: Document[] = [
  {
    title: "Valid Passport",
    description: "Minimum 6 months validity from date of entry.",
    icon: "passport",
  },
  {
    title: "Passport Photographs",
    description: "Recent 2x2 inch color photos with white background.",
    icon: "camera",
  },
  {
    title: "Proof of Funds",
    description: "Last 3 months bank statements & tax returns.",
    icon: "folder",
  },
  {
    title: "Flight Itinerary",
    description: "Confirmed round-trip flight reservations.",
    icon: "plane",
  },
  {
    title: "Hotel Bookings",
    description: "Proof of accommodation for the entire stay.",
    icon: "hotel",
  },
  {
    title: "Employment Proof",
    description: "No Objection Certificate (NOC) from employer.",
    icon: "briefcase",
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Deterministic formatter to avoid server/client hydration mismatch (toLocaleString can differ) */
function formatCurrency(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "Rs 3,000";
  const n = Math.round(value);
  return `Rs ${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function mapVisaTypeToVisaInfo(visa: {
  visa_format?: string | null;
  stay_duration?: string | null;
  validity_period?: string | null;
  entry_type?: string | null;
}): VisaInfo {
  return {
    visaType: visa.visa_format ?? DEFAULT_VISA_INFO.visaType,
    lengthOfStay: visa.stay_duration ?? DEFAULT_VISA_INFO.lengthOfStay,
    validity: visa.validity_period ?? DEFAULT_VISA_INFO.validity,
    entry: visa.entry_type ?? DEFAULT_VISA_INFO.entry,
  };
}

function mapDocumentIconKey(iconKey: string | null | undefined): string {
  const map: Record<string, string> = {
    passport: "passport",
    photo: "camera",
    flight: "plane",
    funds: "folder",
    hotel: "hotel",
    insurance: "folder",
  };
  const k = iconKey ?? "folder";
  return map[k] ?? k;
}

function mapVisaRequirementsToDocuments(
  requirements: Array<{
    document_name?: string | null;
    description?: string | null;
    icon_key?: string | null;
  }>
): Document[] {
  if (!requirements?.length) return DEFAULT_DOCUMENTS;
  return requirements.map((r) => ({
    title: r.document_name ?? "Document",
    description: r.description ?? "",
    icon: mapDocumentIconKey(r.icon_key),
  }));
}

const DEFAULT_HOTSPOT_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop";

/** When DB has no usable hotspot/banner URL, use a known-good image for these slugs (UAE/Dubai share imagery). */
const SLUG_TRENDING_CARD_FALLBACKS: Record<string, string> = {
  dubai: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  "united-arab-emirates":
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  uae: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
};

const DESTINATION_IMAGE_OVERRIDES: Record<string, Record<string, string>> = {
  japan: {
    "osaka castle": "/images/osaka-castle.png",
  },
};

/** Flag code overrides: Dubai → UAE, Schengen → EU (Schengen area flag) */
const FLAG_CODE_OVERRIDES: Record<string, string> = {
  dubai: "ae",
  "united-arab-emirates": "ae",
  schengen: "eu",
};

function resolveFlagCode(name: string, slug: string, isoCode: string): string {
  const key = slug.toLowerCase();
  return FLAG_CODE_OVERRIDES[key] ?? isoCode;
}

function normalizeHotspotImageUrl(
  imageUrl: string | null | undefined
): string | null {
  if (imageUrl == null) return null;
  const t = String(imageUrl).trim();
  return t.length > 0 ? t : null;
}

function mapHotspotToDestination(
  hotspot: {
    title?: string | null;
    description?: string | null;
    image_url?: string | null;
  },
  countrySlug?: string
): Destination {
  const title = hotspot.title ?? "Destination";
  const fromDb = normalizeHotspotImageUrl(hotspot.image_url);
  const overrides = countrySlug ? DESTINATION_IMAGE_OVERRIDES[countrySlug] : undefined;
  const image =
    overrides?.[title.toLowerCase()] ?? fromDb ?? DEFAULT_HOTSPOT_IMAGE;
  return {
    name: title,
    tag: title.toUpperCase().slice(0, 20),
    description: hotspot.description ?? "",
    image,
    href: "#",
  };
}

/** First usable hotspot/banner image for homepage cards (handles empty DB strings + UAE/Dubai). */
export function pickTrendingCardImage(country: CountryVisaData): string {
  const slugFallback = SLUG_TRENDING_CARD_FALLBACKS[country.slug];
  const candidates: (string | undefined)[] = [
    country.destinations?.[0]?.image,
    ...(country.bannerImages ?? []),
    ...(country.destinations ?? []).map((d) => d.image),
  ];
  for (const c of candidates) {
    const u = normalizeHotspotImageUrl(c);
    if (u) return u;
  }
  return slugFallback ?? DEFAULT_HOTSPOT_IMAGE;
}

const getCountriesCached = unstable_cache(
  async (): Promise<CountryVisaData[]> => {
  if (!supabase) {
    console.warn("getCountries: Supabase not configured; returning [].");
    return [];
  }

  const { data: countriesData, error } = await supabase
    .from("countries")
    .select(
      `
      id,
      name,
      iso_code,
      is_active,
      banner_images,
      visa_types (
        id,
        visa_format,
        stay_duration,
        validity_period,
        entry_type,
        embassy_fee,
        service_fee,
        total_cost
      ),
      hotspot_destinations (
        title,
        description,
        image_url
      )
    `
    );

  const activeCountries =
    countriesData?.filter((c) => c.is_active !== false) ?? [];

  if (error) {
    console.error("getCountries:", error);
    return [];
  }

  if (!activeCountries.length) {
    return [];
  }

  const results: CountryVisaData[] = [];

  for (const country of activeCountries) {
    const visaTypes = (country.visa_types as Array<Record<string, unknown>>) ?? [];
    const cheapestVisa = visaTypes.sort(
      (a, b) =>
        (Number(a.total_cost) ?? Infinity) - (Number(b.total_cost) ?? Infinity)
    )[0];

    const visaTypeId = cheapestVisa?.id as string | undefined;
    let documents = DEFAULT_DOCUMENTS;

    if (visaTypeId) {
      const { data: requirements } = await supabase
        .from("visa_requirements")
        .select("document_name, description, icon_key")
        .eq("visa_type_id", visaTypeId);
      documents = mapVisaRequirementsToDocuments(requirements ?? []);
    }

    const name = country.name as string;
    const slug = slugify(name);
    const hotspots = (country.hotspot_destinations as Array<Record<string, unknown>>) ?? [];
    const destinations = hotspots.length
      ? hotspots.map((h) =>
          mapHotspotToDestination(
            h as Parameters<typeof mapHotspotToDestination>[0],
            slug
          )
        )
      : [
          {
            name: "Capital City",
            tag: "EXPLORE",
            description: "Discover the vibrant capital and its attractions.",
            image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
            href: "#",
          },
          {
            name: "Historic Sites",
            tag: "CULTURE",
            description: "Explore the rich history and heritage.",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
            href: "#",
          },
          {
            name: "Natural Beauty",
            tag: "NATURE",
            description: "Experience the country's stunning landscapes.",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
            href: "#",
          },
        ];

    const isoCode = (country.iso_code as string)?.toLowerCase() ?? "xx";

    let bannerImages = (country.banner_images as string[] | null | undefined) ?? [];
    if (!Array.isArray(bannerImages) || bannerImages.filter(Boolean).length === 0) {
      bannerImages = destinations.map((d) => d.image);
    }
    const filteredBannerImages = Array.isArray(bannerImages) ? bannerImages.filter(Boolean) : [];

    results.push({
      id: country.id as string,
      name,
      slug,
      flagCode: resolveFlagCode(name, slug, isoCode),
      startingPrice: formatCurrency(cheapestVisa?.total_cost as number),
      processingTime: DEFAULT_PROCESSING_TIME,
      successRate: DEFAULT_SUCCESS_RATE,
      visaInfo: mapVisaTypeToVisaInfo(cheapestVisa ?? {}),
      destinations,
      documents,
      embassyFee: formatCurrency(cheapestVisa?.embassy_fee as number),
      serviceFee: formatCurrency(cheapestVisa?.service_fee as number),
      totalCost: formatCurrency(cheapestVisa?.total_cost as number),
      destinationsIntro: DEFAULT_DESTINATIONS_INTRO,
      bannerImages: filteredBannerImages.length > 0 ? filteredBannerImages : destinations.map((d) => d.image),
    });
  }

  return results;
  },
  ["countries-visa-data"],
  { revalidate: 120, tags: ["countries"] }
);

export async function getCountries(): Promise<CountryVisaData[]> {
  return getCountriesCached();
}

export async function getCountryBySlug(
  slug: string
): Promise<CountryVisaData | null> {
  const countries = await getCountries();
  const normalizedSlug = slug.toLowerCase().trim();
  return countries.find((c) => c.slug === normalizedSlug) ?? null;
}

export async function getCountrySlugs(): Promise<string[]> {
  const countries = await getCountries();
  return countries.map((c) => c.slug);
}
