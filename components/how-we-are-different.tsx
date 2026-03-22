import { Fragment } from "react";
import { Check, X } from "lucide-react";
import { AnimateInView } from "@/components/animate-in-view";

const features = [
  "Round-the-Clock Dedicated Support",
  "Simplified Application Experience",
  "Expert Application Screening Before Submission",
  "Enterprise-Grade Security & Confidentiality",
  "Fast Appointment Securing for Visa Slots",
  "Money-Back Guarantee on Rejection",
  "Personalized Visa Guidance for Your Trip",
  "Fast Processing & Quick Turnaround",
];

export function HowWeAreDifferent() {
  return (
    <section
      className="bg-[#F4F6F8] py-16"
      aria-labelledby="how-different-title"
    >
      <div className="container">
        <AnimateInView animation="fade-in-up">
          <div className="mb-10 text-center">
            <h2
              id="how-different-title"
              className="text-2xl font-bold text-[#212B36] md:text-3xl"
            >
              How Are We Different?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-base text-[#637381]">
              See how we stand out from the rest with our commitment to quality and
              customer satisfaction.
            </p>
          </div>
        </AnimateInView>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center gap-2 border-b border-r border-gray-200 bg-primary px-6 py-4">
              <Check className="size-5 text-primary-foreground" aria-hidden />
              <span className="font-semibold text-primary-foreground">
                JKV VisaXpress
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 border-b border-gray-200 bg-[#374151] px-6 py-4">
              <X className="size-5 text-white" aria-hidden />
              <span className="font-semibold text-white">Others</span>
            </div>

            {features.map((feature, i) => (
              <Fragment key={i}>
                <div className="flex items-center gap-2 border-b border-r border-gray-200 bg-primary/10 px-6 py-4">
                  <Check
                    className="size-5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-[#212B36] sm:text-base">
                    {feature}
                  </span>
                </div>
                <div className="flex items-center justify-center border-b border-gray-200 bg-gray-100 px-6 py-4">
                  <X className="size-6 text-gray-400" aria-hidden />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
