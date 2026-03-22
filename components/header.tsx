"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ContactFormModal } from "@/components/contact-form-modal";
import type { CountryVisaData } from "@/lib/country-data";

interface HeaderProps {
  preselectedCountryId?: string;
  countries?: CountryVisaData[];
  /** When set (homepage only), Apply Now scrolls to this section instead of opening the modal */
  applyNowHref?: string;
}

export function Header({
  preselectedCountryId,
  countries = [],
  applyNowHref,
}: HeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <nav
        className="container flex h-20 items-center justify-between max-w-4xl py-2"
        aria-label="Main navigation"
      >
        <Link href="/" prefetch className="flex items-center">
          <Image
            src="/New%20Logo.jpg"
            alt="JKV VisaXpress"
            width={200}
            height={70}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/about"
            prefetch
            className="text-sm font-medium text-foreground/90 hover:text-foreground"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            prefetch
            className="text-sm font-medium text-foreground/90 hover:text-foreground"
          >
            Contact Us
          </Link>
          {applyNowHref ? (
            <Button asChild>
              <Link
                href={applyNowHref}
                prefetch={!applyNowHref.includes("#")}
                onClick={(e) => {
                  const id = applyNowHref.includes("#") ? applyNowHref.split("#")[1] : "";
                  const el = id ? document.getElementById(id) : null;
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                Apply Now
              </Link>
            </Button>
          ) : (
            <>
              <Button onClick={() => setModalOpen(true)}>Apply Now</Button>
              <ContactFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                preselectedCountryId={preselectedCountryId}
                countries={countries}
              />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
