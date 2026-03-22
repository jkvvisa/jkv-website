"use client";

import { useState, useEffect } from "react";
import { ContactForm } from "@/components/contact-form";
import { ContactFormModal } from "@/components/contact-form-modal";
import { Button } from "@/components/ui/button";
import type { CountryVisaData } from "@/lib/country-data";

const MD_QUERY = "(min-width: 768px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MD_QUERY);
    setIsDesktop(mq.matches);
    const fn = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return isDesktop;
}

interface ContactFormColumnProps {
  countries: CountryVisaData[];
  variant?: "default" | "contactPage";
  defaultService?: string;
  isRefundMode: boolean;
  /** When false, form is always inline (e.g. dedicated contact page). When true (default), mobile uses modal like homepage. */
  useMobileModal?: boolean;
}

export function ContactFormColumn({
  countries,
  variant = "default",
  defaultService,
  isRefundMode,
  useMobileModal = true,
}: ContactFormColumnProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const buttonLabel = isRefundMode ? "Submit refund request" : "Start application";
  const modalTitle = isRefundMode ? "Request a refund" : "Get in touch";

  if (!useMobileModal) {
    return (
      <ContactForm countries={countries} variant={variant} defaultService={defaultService} />
    );
  }

  if (isDesktop === null) {
    return (
      <div
        className="min-h-[28rem] w-full max-w-xl rounded-xl border border-border/30 bg-muted/30"
        aria-hidden
      />
    );
  }

  if (isDesktop) {
    return (
      <ContactForm countries={countries} variant={variant} defaultService={defaultService} />
    );
  }

  return (
    <>
      <Button className="w-full" size="lg" type="button" onClick={() => setModalOpen(true)}>
        {buttonLabel}
      </Button>
      <ContactFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        countries={countries}
        variant={variant}
        defaultService={defaultService}
        title={modalTitle}
      />
    </>
  );
}
