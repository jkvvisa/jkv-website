export interface VisaInfo {
  visaType: string;
  lengthOfStay: string;
  validity: string;
  entry: string;
}

export interface Destination {
  name: string;
  tag: string;
  description: string;
  image: string;
  href: string;
}

export interface Document {
  title: string;
  description: string;
  icon: string;
}

export interface CountryVisaData {
  id?: string;
  name: string;
  slug: string;
  flagCode: string;
  mapSvg?: string;
  startingPrice: string;
  processingTime: string;
  successRate: string;
  visaInfo: VisaInfo;
  destinations: Destination[];
  documents: Document[];
  embassyFee: string;
  serviceFee: string;
  totalCost: string;
  destinationsIntro: string;
  bannerImages?: string[];
}

const defaultVisaInfo: VisaInfo = {
  visaType: "Sticker",
  lengthOfStay: "Upto 30 days",
  validity: "Upto 90 days",
  entry: "Single",
};

const defaultDocuments: Document[] = [
  { title: "Valid Passport", description: "Minimum 6 months validity from date of entry.", icon: "passport" },
  { title: "Passport Photographs", description: "Recent 2x2 inch color photos with white background.", icon: "camera" },
  { title: "Proof of Funds", description: "Last 3 months bank statements & tax returns.", icon: "folder" },
  { title: "Flight Itinerary", description: "Confirmed round-trip flight reservations.", icon: "plane" },
  { title: "Hotel Bookings", description: "Proof of accommodation for the entire stay.", icon: "hotel" },
  { title: "Employment Proof", description: "No Objection Certificate (NOC) from employer.", icon: "briefcase" },
];

export const COUNTRY_SLUGS = ["japan", "france", "united-arab-emirates"] as const;

export function getCountryData(slug: string): CountryVisaData {
  const countryMap: Record<string, Partial<CountryVisaData>> = {
    japan: {
      name: "Japan",
      slug: "japan",
      flagCode: "jp",
      mapSvg: "/maps/japan.svg",
      startingPrice: "Rs 3,500",
      processingTime: "3-5 Business Days",
      successRate: "99% Success Rate",
      visaInfo: { ...defaultVisaInfo },
      destinations: [
        { name: "Shibuya Crossing", tag: "TOKYO", description: "Experience the organized chaos of the world's busiest intersection and the neon-lit energy of modern Tokyo.", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop", href: "#" },
        { name: "Fushimi Inari Shrine", tag: "KYOTO", description: "Walk through thousands of vermilion torii gates that wind through the sacred forest of Mount Inari.", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", href: "#" },
        { name: "Osaka Castle", tag: "OSAKA", description: "Discover Japan's storied past at this iconic landmark, especially breathtaking during cherry blossom season.", image: "/images/osaka-castle.png", href: "#" },
      ],
      destinationsIntro: "Get inspired for your upcoming journey to the Land of the Rising Sun with these must-visit locations.",
      embassyFee: "Rs 1,500",
      serviceFee: "Rs 2,000",
      totalCost: "Rs 3,500",
    },
    france: {
      name: "France",
      slug: "france",
      flagCode: "fr",
      mapSvg: "/maps/france.svg",
      startingPrice: "Rs 4,200",
      processingTime: "5-7 Business Days",
      successRate: "99% Success Rate",
      visaInfo: { ...defaultVisaInfo, entry: "Multiple" },
      destinations: [
        { name: "Eiffel Tower", tag: "PARIS", description: "Rise to the top of this iconic iron lattice tower and take in sweeping views of the City of Light.", image: "https://images.unsplash.com/photo-1511739001846-f6e0b846d53d?w=400&h=300&fit=crop", href: "#" },
        { name: "Louvre Museum", tag: "PARIS", description: "Explore the world's largest art museum, home to the Mona Lisa and countless masterpieces.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop", href: "#" },
        { name: "French Riviera", tag: "NICE", description: "Discover the stunning Mediterranean coastline with its glamorous resorts and azure waters.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", href: "#" },
      ],
      destinationsIntro: "Discover the charm of France with these iconic destinations and hidden gems.",
      embassyFee: "Rs 1,800",
      serviceFee: "Rs 2,400",
      totalCost: "Rs 4,200",
    },
    "united-arab-emirates": {
      name: "United Arab Emirates",
      slug: "united-arab-emirates",
      flagCode: "ae",
      mapSvg: "/maps/united-arab-emirates.svg",
      startingPrice: "Rs 2,800",
      processingTime: "2-4 Business Days",
      successRate: "99% Success Rate",
      visaInfo: { ...defaultVisaInfo },
      destinations: [
        { name: "Burj Khalifa", tag: "DUBAI", description: "Ascend the world's tallest building for breathtaking panoramic views of Dubai's skyline.", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", href: "#" },
        { name: "Sheikh Zayed Mosque", tag: "ABU DHABI", description: "Marvel at this magnificent white marble mosque, one of the world's most beautiful places of worship.", image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400&h=300&fit=crop", href: "#" },
        { name: "Palm Jumeirah", tag: "DUBAI", description: "Explore this iconic palm-shaped archipelago with its luxury hotels and pristine beaches.", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop", href: "#" },
      ],
      destinationsIntro: "Explore the blend of tradition and modernity in the UAE's most spectacular destinations.",
      embassyFee: "Rs 1,200",
      serviceFee: "Rs 1,600",
      totalCost: "Rs 2,800",
    },
  };

  const country = countryMap[slug.toLowerCase()] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug,
    flagCode: "xx",
    startingPrice: "Rs 3,000",
    processingTime: "5-7 Business Days",
    successRate: "99% Success Rate",
    visaInfo: defaultVisaInfo,
    destinations: [
      { name: "Capital City", tag: "EXPLORE", description: "Discover the vibrant capital and its attractions.", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop", href: "#" },
      { name: "Historic Sites", tag: "CULTURE", description: "Explore the rich history and heritage.", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop", href: "#" },
      { name: "Natural Beauty", tag: "NATURE", description: "Experience the country's stunning landscapes.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", href: "#" },
    ],
    destinationsIntro: "Get inspired for your upcoming journey with these must-visit locations.",
    embassyFee: "Rs 1,500",
    serviceFee: "Rs 1,500",
    totalCost: "Rs 3,000",
  };

  return {
    name: country.name!,
    slug: country.slug!,
    flagCode: country.flagCode || "xx",
    mapSvg: country.mapSvg,
    startingPrice: country.startingPrice!,
    processingTime: country.processingTime!,
    successRate: country.successRate!,
    visaInfo: country.visaInfo || defaultVisaInfo,
    destinations: country.destinations!,
    documents: defaultDocuments,
    embassyFee: country.embassyFee || "Rs 1,500",
    serviceFee: country.serviceFee || "Rs 1,500",
    totalCost: country.totalCost || "Rs 3,000",
    destinationsIntro: country.destinationsIntro || "Get inspired for your upcoming journey with these must-visit locations.",
  };
}
