import { Check } from "lucide-react";
import { getCountries } from "@/lib/countries";
import { AnimateInView } from "@/components/animate-in-view";
import { SeasonalDestinationCardDynamic } from "@/components/seasonal-destination-card-dynamic";

const steps = [
  {
    title: "Check Eligibility",
    description: "Instantly find out which visa you need based on your destination and nationality.",
  },
  {
    title: "Upload Documents",
    description: "Securely upload your photos and identification using our encrypted portal.",
  },
  {
    title: "Expert Review",
    description: "Our specialists review your application to ensure 100% compliance before submission.",
  },
  {
    title: "Get Your Visa",
    description: "Receive your visa directly in your dashboard or delivered to your doorstep.",
  },
];

export async function ApplicationProcess() {
  const countries = await getCountries();

  return (
    <section
      className="container py-16"
      aria-label="Application process"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <AnimateInView animation="fade-in-up" className="order-2 lg:order-1">
        <div>
          <ul className="relative m-0 list-none p-0">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="relative pb-6 last:pb-0 md:pb-8"
              >
                {index < steps.length - 1 && (
                  <div
                    className="absolute left-[9px] top-[1.125rem] bottom-0 w-px -translate-x-1/2 bg-primary/40"
                    aria-hidden
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <span
                    className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-primary bg-background [&_svg]:block"
                    aria-hidden
                  >
                    <Check className="size-[11px] text-primary" strokeWidth={2.75} />
                  </span>
                  <h3 className="min-w-0 flex-1 text-lg font-bold leading-tight text-[#1F2937] md:text-xl">
                    {step.title}
                  </h3>
                </div>
                <p className="relative z-10 mt-1.5 pl-[30px] text-sm font-normal leading-snug text-[#4B5563] md:mt-2 md:pl-9 md:text-[0.9375rem]">
                  {step.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        </AnimateInView>

        <div className="relative order-1 lg:order-2">
          {countries.length > 0 ? (
            <SeasonalDestinationCardDynamic countries={countries} />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-[#f3f6f9] text-muted-foreground">
              <span className="text-sm">No destinations available</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
