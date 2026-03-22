"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** App routes to warm after first paint (header, footer, common service pages). */
const PREFETCH_HREFS = [
  "/about",
  "/contact",
  "/destinations",
  "/refund",
  "/terms",
  "/services/passport-renewal",
  "/services/travel-insurance",
  "/services/visa-purpose-bookings",
  "/services/rental-agreement",
  "/services/marriage-affidavit",
] as const;

/**
 * Calls router.prefetch after idle time so navigations to these paths feel instant.
 * Next.js Link also prefetches on viewport; this complements that for below-the-fold links.
 */
export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      for (const href of PREFETCH_HREFS) {
        try {
          router.prefetch(href);
        } catch {
          /* noop */
        }
      }
    };

    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const id = setTimeout(run, 200);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [router]);

  return null;
}
