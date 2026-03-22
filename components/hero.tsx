import { Check, CircleCheckBig, Headset } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";

export function Hero() {
  return (
    <section
      className="bg-gray-100 overflow-visible"
      aria-labelledby="hero-title"
    >
      <div className="container flex flex-col items-center gap-8 py-16 md:py-24">
      <div className="flex max-w-3xl flex-col items-center gap-4 text-center text-gray-500">
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

      <div className="animate-fade-in-up animation-delay-300 flex flex-wrap items-center justify-center gap-8 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary" aria-hidden>
            <Check className="size-3.5 text-white stroke-[3]" />
          </span>
          <span className="text-sm font-medium">15K+ Visas Processed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary" aria-hidden>
            <CircleCheckBig className="size-3.5 text-white stroke-[3]" />
          </span>
          <span className="text-sm font-medium">24h Priority Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary" aria-hidden>
            <Headset className="size-3.5 text-white stroke-[3]" />
          </span>
          <span className="text-sm font-medium">Expert Assistance</span>
        </div>
      </div>
    </div>
    </section>
  );
}
