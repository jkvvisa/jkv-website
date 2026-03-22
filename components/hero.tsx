import { Check, CircleCheckBig, Headset } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";

export function Hero() {
  return (
    <section
      className="bg-gray-100 overflow-visible"
      aria-labelledby="hero-title"
    >
      <div className="container section-y flex flex-col items-center gap-6 md:gap-8">
      <div className="flex max-w-3xl flex-col items-center gap-3 text-center text-gray-500 md:gap-4">
        <h1
          id="hero-title"
          className="animate-fade-in-up text-4xl font-bold tracking-tight md:text-5xl"
        >
          Fast, Secure, & Reliable{" "}
          <span className="text-primary">Visa Solutions</span>
        </h1>
        <p className="animate-fade-in-up animation-delay-100 text-lg">
          Streamline your global travel with our expert-led visa processing
          platform. Experience speed and accuracy in every application.
        </p>
      </div>

      <div className="animate-fade-in-up animation-delay-200 w-full max-w-3xl">
        <HeroSearch />
      </div>

      <div className="animate-fade-in-up animation-delay-300 w-full max-w-3xl">
        <div className="flex flex-col gap-2.5 text-gray-500 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-8">
          <div className="flex w-full items-center justify-start gap-2.5 md:w-auto md:justify-center">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary md:size-6" aria-hidden>
              <Check className="size-3 text-white stroke-[3] md:size-3.5" />
            </span>
            <span className="text-left text-xs font-medium leading-snug md:text-sm">15K+ Visas Processed</span>
          </div>
          <div className="flex w-full items-center justify-start gap-2.5 md:w-auto md:justify-center">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary md:size-6" aria-hidden>
              <CircleCheckBig className="size-3 text-white stroke-[3] md:size-3.5" />
            </span>
            <span className="text-left text-xs font-medium leading-snug md:text-sm">24h Priority Processing</span>
          </div>
          <div className="flex w-full items-center justify-start gap-2.5 md:w-auto md:justify-center">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary md:size-6" aria-hidden>
              <Headset className="size-3 text-white stroke-[3] md:size-3.5" />
            </span>
            <span className="text-left text-xs font-medium leading-snug md:text-sm">Expert Assistance</span>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
