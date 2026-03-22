"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceRequestForm } from "@/components/service-request-form";
import {
  Check,
  Plane,
  FileText,
  Building2,
  ChevronDown,
  ChevronUp,
  Info,
  Phone,
  MessageCircle,
} from "lucide-react";
import { ServiceRequestSteps } from "./service-request-steps";

const PRICING_PLANS = [
  {
    id: "flight",
    name: "Flight Itinerary",
    price: 499,
    unit: " /per person",
    features: [
      "24 Hours Delivery",
      "Get 2 Flight itineraries per person",
      "Name change not allowed",
    ],
    popular: false,
  },
  {
    id: "hotel",
    name: "Hotel Reservation",
    price: 499,
    unit: " /per person",
    features: [
      "24 Hours Delivery",
      "Get 2 Hotel Reservations per person",
      "Name change not allowed",
    ],
    popular: false,
  },
  {
    id: "itinerary",
    name: "Day to Day Itinerary",
    price: 499,
    unit: " /per person",
    features: [
      "24 Hours Delivery",
      "Daywise Itineraries for visa purpose",
      "Details of the tour for the duration",
    ],
    popular: false,
  },
  {
    id: "visa-preferential",
    name: "Most Preferred",
    price: 999,
    unit: " /per person",
    features: [
      "24 Hours Delivery",
      "Flight Itinerary",
      "Hotel Reservation",
      "Day to Day Itinerary",
      "Name change not allowed",
    ],
    popular: true,
  },
];

const SPECIALIZED_SERVICES = [
  {
    icon: Plane,
    title: "Flight Itineraries",
    desc: "Flight reservations for your visa application with your travel dates and personal details.",
  },
  {
    icon: Building2,
    title: "Hotel Reservation",
    desc: "Hotel booking confirmation for your visa application with your travel dates and personal details.",
  },
  {
    icon: FileText,
    title: "Day to Day Itinerary",
    desc: "A detailed day-by-day travel plan outlining your itinerary for the embassy.",
  },
];

const FAQS = [
  {
    q: "Will embassies accept these temporary itineraries for visa applications?",
    a: "These itineraries are designed for visa applications and can be used for visa purposes. They have been used by countless members applying through us. They are not actual bookings.",
  },
  {
    q: "What exactly is a dummy flight itinerary?",
    a: "A dummy flight itinerary is a document that looks like a flight booking but is not a real purchase. It is used to show visa officers that you have planned your travel.",
  },
  {
    q: "Are these verifiable reservations with the airline or hotel?",
    a: "No. These itineraries are designed for visa applications and do not constitute actual bookings or confirmations with the airline or hotel.",
  },
  {
    q: "Do you offer combo packages for all flight, hotel and day to day itineraries?",
    a: "Yes. Our Most Preferred plan includes flight itinerary, hotel confirmation, and day to day itinerary in one package.",
  },
  {
    q: "Do you offer refunds in the event of a visa rejection?",
    a: "Yes. You can cancel or get a refund if your visa is denied, without any deduction. Our policies are designed to support you through the visa process.",
  },
];

const PLAN_OPTIONS = [
  { value: "flight", label: "Flight Itinerary" },
  { value: "hotel", label: "Hotel Reservation" },
  { value: "itinerary", label: "Day to Day Itinerary" },
  { value: "visa-preferential", label: "Most Preferred" },
];

export function VisaPurposeBookingsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const contactFormRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0b182c] py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,149,81,0.08)_0%,transparent_50%)]" />
        <div className="container relative">
          <div>
            <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              Visa support
            </span>
            <h1 className="mt-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Dummy travel documents for visa applications
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Get dummy flight and hotel bookings without buying costly real tickets.
              Keep your options flexible while preparing your visa application.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="rounded-lg"
                onClick={() => pricingRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" ref={pricingRef} className="bg-[#F4F6F8] py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1C2B3A] md:text-3xl">
              Pricing
            </h2>
            <p className="mt-3 text-[#6B7280]">
              Transparent fees. Group discounts available. No hidden charges.
            </p>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-[#1C2B3A]">
              <span className="font-semibold">Please Note:</span> These itineraries are designed for visa applications and can be used for visa purposes, which has been used by countless members applying through us. They are not actual bookings.
            </p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl p-6 shadow-md ${
                  plan.popular
                    ? "bg-primary"
                    : "border border-gray-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-[#1C2B3A]">
                    Most Popular
                  </span>
                )}
                <h3
                  className={`font-bold ${
                    plan.popular ? "text-white" : "text-[#1C2B3A]"
                  }`}
                >
                  {plan.name}
                </h3>
                <p className="mt-2">
                  <span
                    className={`text-2xl font-bold ${
                      plan.popular ? "text-white" : "text-primary"
                    }`}
                  >
                    ₹{plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.popular ? "text-white/90" : "text-[#6B7280]"
                    }`}
                  >
                    {plan.unit}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.popular ? "bg-white/30" : "bg-primary/20"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            plan.popular ? "text-white" : "text-primary"
                          }`}
                        />
                      </div>
                      <span
                        className={
                          plan.popular ? "text-white" : "text-[#1C2B3A]"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-6 w-full rounded-lg ${
                    plan.popular
                      ? "border-0 bg-white text-primary hover:bg-gray-100"
                      : "border-2 border-primary bg-white text-primary hover:bg-primary/5"
                  }`}
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Get started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Specialized Services */}
      <section className="border-b border-gray-200 bg-white py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1C2B3A] md:text-3xl">
              Our Specialized Services
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SPECIALIZED_SERVICES.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-gray-50/80 p-6 text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-bold text-[#1C2B3A]">{item.title}</h3>
                <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1C2B3A] md:text-3xl">
              FAQs
            </h2>
            <p className="mt-2 text-[#6B7280]">
              Answers to common questions about dummy bookings.
            </p>
            <div className="mt-8 space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-gray-50/80 p-4"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 text-left font-medium text-[#1C2B3A]"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                      {openFaq === i ? (
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-4 border-t border-gray-200 pt-4 text-sm text-[#6B7280]">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Unsure which plan suits you best?
            </h2>
            <p className="mt-4 text-primary-foreground/90">
              Let our specialists guide you to the perfect itinerary package for your specific visa application.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-lg bg-white text-primary hover:bg-gray-100"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call an Agent
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-2 border-white bg-transparent text-white hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with an Expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact-form" ref={contactFormRef} className="border-t border-gray-200 bg-[#F8F9FA] py-16">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <ServiceRequestSteps
              title="Request your dummy booking"
              subtitle="Fill out the form below and our visa experts will get in touch with you within 24 hours to guide you through the next steps."
            />
            <ServiceRequestForm
              defaultService="visa-purpose-bookings"
              serviceTitle="Visa Purpose Bookings"
              planOptedOptions={PLAN_OPTIONS}
              defaultPlanOpted={selectedPlan}
              fullWidth
              standaloneCard
            />
          </div>
        </div>
      </section>
    </div>
  );
}
