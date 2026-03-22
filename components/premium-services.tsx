import { FileText, CalendarCheck, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateInView } from "@/components/animate-in-view";

const services = [
  {
    icon: FileCheck,
    title: "Document Validation",
    description:
      "Document Validation in compliance with Embassy checklist. Professional document checking to ensure your application meets all Embassy requirements the first time.",
  },
  {
    icon: CalendarCheck,
    title: "Secure Appointment",
    description:
      "Secure Visa Appointment. We handle the scheduling of your biometric and interview appointments at the embassy or VFS.",
  },
  {
    icon: FileText,
    title: "Complete Preparation",
    description:
      "Cover letter preparation with day wise itinerary and visa application form filling. Expertly crafted documents tailored to your travel plans.",
  },
];

export function PremiumServices() {
  return (
    <section
      className="bg-[#0b182c] section-y"
      aria-labelledby="services-title"
    >
      <div className="container">
        <AnimateInView animation="fade-in-up">
          <div className="mb-12 text-center">
            <h2 id="services-title" className="text-2xl font-bold text-[#f0f0f0] md:text-3xl">
              Our Premium Services
            </h2>
            <p className="mt-2 text-base text-[#b0b0b0]">
              We handle the complexity so you can focus on your journey.
            </p>
          </div>
        </AnimateInView>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="flex h-full flex-col border-white/15 bg-[#162d44] shadow-lg"
            >
              <CardContent className="flex flex-1 flex-col px-8 py-8">
                <div
                  className="mb-5 flex size-[34px] items-center justify-center text-[#fb923c]"
                  aria-hidden
                >
                  <service.icon className="size-8" />
                </div>
                <h3 className="mb-4 text-xl font-bold leading-tight text-[#f0f0f0]">
                  {service.title}
                </h3>
                <p className="flex-1 text-base font-normal leading-[1.6] text-[#d4d6d9]">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
