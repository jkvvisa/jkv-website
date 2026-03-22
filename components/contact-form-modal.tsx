"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import type { CountryVisaData } from "@/lib/country-data";

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  preselectedCountryId?: string;
  countries?: CountryVisaData[];
}

export function ContactFormModal({
  open,
  onClose,
  preselectedCountryId,
  countries = [],
}: ContactFormModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 id="contact-modal-title" className="text-lg font-semibold text-[#1F2937]">
            Apply for this Visa
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0"
          >
            <X className="size-5" />
          </Button>
        </div>
        <div className="p-6">
          <ContactForm
            countries={countries}
            defaultCountryId={preselectedCountryId}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}
