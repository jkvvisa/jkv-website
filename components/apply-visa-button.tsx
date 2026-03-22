"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactFormModal } from "@/components/contact-form-modal";
import type { CountryVisaData } from "@/lib/country-data";

interface ApplyVisaButtonProps {
  countryId?: string;
  countrySlug?: string;
  countries?: CountryVisaData[];
}

export function ApplyVisaButton({
  countryId,
  countrySlug,
  countries = [],
}: ApplyVisaButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const preselectedId = countryId ?? countrySlug;

  return (
    <>
      <Button size="lg" onClick={() => setModalOpen(true)}>
        Apply for this Visa
      </Button>
      <ContactFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedCountryId={preselectedId}
        countries={countries}
      />
    </>
  );
}
