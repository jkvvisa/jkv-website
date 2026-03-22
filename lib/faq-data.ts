export interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_TEMPLATES: FAQItem[] = [
  {
    question: "What type of visa do I need to visit {country}?",
    answer:
      "For tourism and short stays, most travelers need a Tourist Visa. Business travelers may require a Business Visa. The exact visa type depends on your purpose of visit, nationality, and duration. Our team will guide you to the right visa category based on your travel plans.",
  },
  {
    question: "How long does the {country} visa processing take?",
    answer:
      "Processing times vary by visa type and embassy workload. Typically, standard processing takes 5-7 business days. We offer expedited processing for urgent applications where available. You'll receive updates at each stage of your application.",
  },
  {
    question: "What documents are required for a {country} visa?",
    answer:
      "Common requirements include a valid passport (minimum 6 months validity), passport-sized photographs, proof of accommodation, flight itinerary, bank statements, and travel insurance where applicable. Our document checklist is tailored to your specific visa type and will be shared once you start your application.",
  },
  {
    question: "Can I apply for a {country} visa if my passport expires soon?",
    answer:
      "Most countries require your passport to be valid for at least 6 months from your intended date of entry. If your passport expires sooner, we recommend renewing it before applying. We can assist with the renewal process if needed.",
  },
  {
    question: "What is the validity period of a {country} visa?",
    answer:
      "Visa validity varies by type—single entry visas are typically valid for 30-90 days, while multiple entry visas can be valid for 6 months to 10 years. The validity and permitted stay duration will be clearly stated on your visa approval.",
  },
  {
    question: "Do I need to appear in person for a {country} visa?",
    answer:
      "Many countries now offer e-visa or online application options that don't require an in-person visit. For sticker visas, some embassies may require a biometric appointment. We'll inform you of any in-person requirements when you apply.",
  },
  {
    question: "What if my {country} visa application is rejected?",
    answer:
      "We offer a money-back guarantee on our service fee in case of rejection due to document or application errors on our part. If rejected, we'll help you understand the reason and guide you on reapplying or appealing where possible.",
  },
  {
    question: "Can I extend my stay in {country} after arrival?",
    answer:
      "Extension policies vary by country. Some allow in-country extensions for tourism, while others require you to leave and reapply. We recommend planning your stay within the initial visa validity. Contact us for country-specific extension rules.",
  },
  {
    question: "Is travel insurance mandatory for {country}?",
    answer:
      "Some countries (e.g., Schengen) require minimum medical coverage (€30,000). For others, it's strongly recommended. We can advise on the exact requirements for your destination and help you obtain suitable coverage.",
  },
  {
    question: "How far in advance should I apply for a {country} visa?",
    answer:
      "We recommend applying at least 4-6 weeks before your travel date to account for processing time and any unexpected delays. For peak travel seasons, apply even earlier. Rush processing may be available for last-minute applications.",
  },
  {
    question: "Can I work on a tourist visa in {country}?",
    answer:
      "No. Tourist visas are strictly for leisure, sightseeing, and short visits. Working, even remotely, may violate visa terms. For employment, you'll need a work permit or appropriate business visa. We can guide you on the correct visa type.",
  },
  {
    question: "What are the photo requirements for a {country} visa?",
    answer:
      "Typically, you need recent passport-sized color photos (usually 35x45mm or 2x2 inches) on a white background, taken within the last 6 months. Specific size and format may vary by country. We provide detailed photo guidelines with your application kit.",
  },
  {
    question: "Does {country} require a visa for transit passengers?",
    answer:
      "Transit visa requirements depend on your nationality, layover duration, and whether you'll leave the airport. Some countries offer visa-free transit for short layovers. Share your itinerary with us and we'll confirm if you need a transit visa.",
  },
  {
    question: "How do I track my {country} visa application status?",
    answer:
      "Once you apply through JKV VisaXpress, you'll receive a reference number and access to our tracking portal. Our team also provides email and SMS updates at key stages. You can reach our support team 24/7 for status inquiries.",
  },
  {
    question: "Are there any vaccination requirements for {country}?",
    answer:
      "Some countries require proof of vaccination (e.g., yellow fever) depending on your travel history. COVID-19 requirements have been relaxed in most places. We'll inform you of any health documentation needed for your specific route and destination.",
  },
];

export function getCountryFAQs(countryName: string): FAQItem[] {
  return FAQ_TEMPLATES.map((faq) => ({
    question: faq.question.replace(/{country}/g, countryName),
    answer: faq.answer.replace(/{country}/g, countryName),
  }));
}
