"use client";

import { useSearchParams } from "next/navigation";
import { ContactSection } from "./contact-section";
import type { CountryVisaData } from "@/lib/country-data";

interface ContactPageWrapperProps {
  countries: CountryVisaData[];
  defaultServiceFromServer?: string;
}

export function ContactPageWrapper({ countries, defaultServiceFromServer }: ContactPageWrapperProps) {
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get("service");
  const defaultService = defaultServiceFromServer ?? (serviceFromUrl === "refund-process" ? "refund-process" : undefined);

  return (
    <ContactSection
      countries={countries}
      variant="contactPage"
      defaultService={defaultService}
    />
  );
}
