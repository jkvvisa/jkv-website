import {
  Award,
  Users,
  FileCheck,
  Globe,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import { AnimateInView } from "@/components/animate-in-view";

const reasons = [
  {
    icon: Award,
    title: "99% Success Rate",
    description:
      "Our proven track record speaks for itself. We ensure your application meets all requirements before submission.",
  },
  {
    icon: Users,
    title: "Expert Visa Specialists",
    description:
      "Dedicated professionals with years of experience handling visa applications for destinations worldwide.",
  },
  {
    icon: FileCheck,
    title: "Document Pre-Check",
    description:
      "We review your documents against embassy checklists to catch issues before submission and avoid rejections.",
  },
  {
    icon: Globe,
    title: "30+ Countries Covered",
    description:
      "From tourist to business visas, we support applications for a wide range of destinations and visa types.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Round-the-clock assistance from our team. Get your questions answered whenever you need help.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted by Thousands",
    description:
      "Join 15,000+ travelers who have successfully obtained their visas through our platform.",
  },
];

export function WhyChooseUs() {
  return (
    <section
      className="bg-white py-16"
      aria-labelledby="why-choose-us-title"
    >
      <div className="container">
        <AnimateInView animation="fade-in-up">
          <div className="mb-12 text-center">
            <h2
              id="why-choose-us-title"
              className="text-2xl font-bold text-[#212B36] md:text-3xl"
            >
              Why Choose Us?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[#637381]">
              We make visa applications simple, secure, and stress-free. Here's
              what sets us apart.
            </p>
          </div>
        </AnimateInView>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex gap-4 rounded-xl border border-gray-200 bg-[#F4F6F8]/50 p-6 transition-shadow hover:shadow-md hover:-translate-y-0.5 duration-300"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#fed7aa] bg-[#fff7ed]">
                <reason.icon className="size-6 text-[#fb923c]" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#212B36]">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm text-[#637381]">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
