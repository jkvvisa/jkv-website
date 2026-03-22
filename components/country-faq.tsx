"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import type { FAQItem } from "@/lib/faq-data";
import { Button } from "@/components/ui/button";

const INITIAL_VISIBLE = 5;

interface CountryFAQProps {
  faqs: FAQItem[];
  countryName: string;
}

export function CountryFAQ({ faqs, countryName }: CountryFAQProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleFaqs = expanded ? faqs : faqs.slice(0, INITIAL_VISIBLE);
  const hasMore = faqs.length > INITIAL_VISIBLE;

  return (
    <section
      className="bg-white py-16"
      aria-labelledby="faq-title"
    >
      <div className="container">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary">
            <HelpCircle className="size-6 text-primary-foreground" />
          </div>
          <h2
            id="faq-title"
            className="text-2xl font-bold text-[#1F2937] md:text-3xl"
          >
            Frequently Asked Questions about {countryName} Visa
          </h2>
        </div>

        <div className="space-y-4">
          {visibleFaqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-gray-200 bg-gray-50/50 transition-colors hover:bg-gray-50"
              suppressHydrationWarning
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-[#1F2937] [&::-webkit-details-marker]:hidden">
                <span className="pr-4">{faq.question}</span>
                <ChevronDown className="size-5 shrink-0 text-[#6B7280] transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-gray-200 px-6 py-4">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {hasMore && !expanded && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setExpanded(true)}
              className="gap-2"
            >
              View more
              <ChevronDown className="size-5" />
            </Button>
          </div>
        )}

        {hasMore && expanded && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(false)}
              className="gap-2 text-[#6B7280]"
            >
              Show less
              <ChevronUp className="size-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
