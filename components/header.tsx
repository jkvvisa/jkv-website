"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactFormModal } from "@/components/contact-form-modal";
import type { CountryVisaData } from "@/lib/country-data";
import { cn } from "@/lib/utils";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleApplyNowClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!applyNowHref?.includes("#")) return;
    const id = applyNowHref.split("#")[1];
    const el = id ? document.getElementById(id) : null;
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeMenu();
  }

  const desktopApply = applyNowHref ? (
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
    <Button onClick={() => setModalOpen(true)}>Apply Now</Button>
  );

  const mobileApply = applyNowHref ? (
    <Button asChild size="sm" className="shrink-0 px-3 text-sm">
      <Link
        href={applyNowHref}
        prefetch={!applyNowHref.includes("#")}
        onClick={handleApplyNowClick}
      >
        Apply Now
      </Link>
    </Button>
  ) : (
    <Button size="sm" className="shrink-0 px-3 text-sm" onClick={() => setModalOpen(true)}>
      Apply Now
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-background">
      <nav
        className="container flex h-16 items-center justify-between gap-3 md:h-20 md:max-w-4xl"
        aria-label="Main navigation"
      >
        <Link href="/" prefetch className="flex min-w-0 shrink items-center" onClick={closeMenu}>
          <Image
            src="/New%20Logo.jpg"
            alt="JKV VisaXpress"
            width={200}
            height={70}
            className="h-9 w-auto object-contain md:h-14"
            priority
          />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/about"
            prefetch
            className="whitespace-nowrap text-sm font-medium text-foreground"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            prefetch
            className="whitespace-nowrap text-sm font-medium text-foreground"
          >
            Contact Us
          </Link>
          {desktopApply}
        </div>

        {/* Mobile: Apply + menu */}
        <div className="flex items-center gap-1.5 md:hidden">
          {mobileApply}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-16 z-40 border-b border-gray-200 bg-background shadow-lg transition-[visibility,opacity] duration-200 md:hidden",
          menuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <div className="container flex flex-col gap-1 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <Link
            href="/about"
            prefetch
            className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            prefetch
            className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
            onClick={closeMenu}
          >
            Contact Us
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-16 z-30 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      {!applyNowHref ? (
        <ContactFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          preselectedCountryId={preselectedCountryId}
          countries={countries}
        />
      ) : null}
    </header>
  );
}
