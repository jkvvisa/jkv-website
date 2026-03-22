"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import type { CountryVisaData } from "@/lib/country-data";

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  preselectedCountryId?: string;
  countries?: CountryVisaData[];
  variant?: "default" | "contactPage";
  defaultService?: string;
  /** Dialog title (default: Apply for this Visa) */
  title?: string;
}

export function ContactFormModal({
  open,
  onClose,
  preselectedCountryId,
  countries = [],
  variant = "default",
  defaultService,
  title = "Apply for this Visa",
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

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex h-dvh max-h-dvh flex-col bg-white"
      aria-modal="true"
      role="dialog"
      aria-labelledby="contact-modal-title"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pb-4 sm:pt-4">
        <h2
          id="contact-modal-title"
          className="pr-2 text-base font-semibold leading-snug text-[#1F2937] sm:text-lg"
        >
          {title}
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
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-6 sm:pt-4">
        <div className="mx-auto w-full max-w-xl">
          <ContactForm
            countries={countries}
            defaultCountryId={preselectedCountryId}
            onSuccess={onClose}
            variant={variant}
            defaultService={defaultService}
            hideHeader
          />
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;

  return createPortal(modal, document.body);
}
