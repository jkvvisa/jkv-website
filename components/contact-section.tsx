import { CheckCircle, Shield, Clock, DollarSign, FileText, Search, RotateCcw } from "lucide-react";
import { ContactForm } from "./contact-form";
import type { CountryVisaData } from "@/lib/country-data";

const REFUND_STEPS = [
  {
    icon: FileText,
    title: "Submit Your Request",
    desc: "Fill out the form with your details.",
  },
  {
    icon: Search,
    title: "We Review Your Case",
    desc: "Our team verifies your eligibility against our refund policy and contacts you if needed.",
  },
  {
    icon: RotateCcw,
    title: "Refund Processed",
    desc: "Once approved, your refund is processed within 48–72 hours to your original payment method.",
  },
];

interface ContactSectionProps {
  countries?: CountryVisaData[];
  /** When "contactPage", shows Services Required dropdown instead of Purpose of Travel + Country */
  variant?: "default" | "contactPage";
  /** Preselected service when coming from refund page (e.g. "refund-process") */
  defaultService?: string;
}

export function ContactSection({ countries = [], variant = "default", defaultService }: ContactSectionProps) {
  const isRefundMode = defaultService === "refund-process";

  return (
    <section
      id="contact"
      className="bg-[#F4F6F8] py-16 scroll-mt-24"
      aria-labelledby="contact-title"
    >
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-stretch">
        <div className="flex h-full min-h-0 flex-col">
          {isRefundMode ? (
            <>
              <h2 id="contact-title" className="text-2xl font-bold leading-tight text-[#212B36] text-justify md:text-3xl">
                Request a Refund
              </h2>
              <p className="mt-2 min-w-0 text-base font-normal text-[#637381] text-justify">
                Fill out the form below and our team will review your refund request and get back to you within 24 hours.
              </p>
              <div className="mt-8 space-y-4">
                {REFUND_STEPS.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#fed7aa] bg-[#fff7ed]">
                      <item.icon className="size-5 text-[#fb923c]" aria-hidden />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-[#212B36]">{item.title}</span>
                      <p className="mt-1 text-sm font-normal text-[#637381]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="grid w-fit">
                <h2 id="contact-title" className="text-2xl font-bold leading-tight text-[#212B36] text-justify md:text-3xl">
                  Ready to start your application?
                </h2>
                <p className="mt-2 min-w-0 text-base font-normal text-[#637381] text-justify">
                  Fill out the form below and our visa experts will get in touch with
                  you within 24 hours to guide you through the next steps.
                </p>
              </div>

              <ul className="mt-10 flex flex-col gap-6.5">
                <li className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#fed7aa] bg-[#fff7ed]">
                    <CheckCircle className="size-5 text-[#fb923c]" aria-hidden />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-[#212B36]">Personalized Guidance</span>
                    <p className="mt-2.5 text-sm font-normal leading-snug text-[#637381]">
                      Tailored advice based on your specific travel purpose and profile.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#fed7aa] bg-[#fff7ed]">
                    <Shield className="size-5 text-[#fb923c]" aria-hidden />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-[#212B36]">Secure Handling</span>
                    <p className="mt-2.5 text-sm font-normal leading-snug text-[#637381]">
                      Your data is protected with enterprise-grade encryption and security protocols.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#fed7aa] bg-[#fff7ed]">
                    <Clock className="size-5 text-[#fb923c]" aria-hidden />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-[#212B36]">Fast Validation</span>
                    <p className="mt-2.5 text-sm font-normal leading-snug text-[#637381]">
                      Most documents validated within 24–48 hours of document submission.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#fed7aa] bg-[#fff7ed]">
                    <DollarSign className="size-5 text-[#fb923c]" aria-hidden />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-[#212B36]">Transparent Pricing</span>
                    <p className="mt-2.5 text-sm font-normal leading-snug text-[#637381]">
                      No hidden fees. Clear breakdown of all costs before you commit.
                    </p>
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>

        <ContactForm countries={countries} variant={variant} defaultService={defaultService} />
      </div>
    </section>
  );
}
