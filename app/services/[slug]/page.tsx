import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceRequestForm } from "@/components/service-request-form";
import { ServiceRequestSteps } from "@/components/service-request-steps";
import { TravelInsuranceForm } from "@/components/travel-insurance-form";
import { MarriageAffidavitForm } from "@/components/marriage-affidavit-form";
import { VisaPurposeBookingsPage } from "@/components/visa-purpose-bookings-page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SERVICE_MAP: Record<string, { title: string; description?: string }> = {
  "passport-renewal": { title: "Passport Renewal" },
  "travel-insurance": { title: "Travel Insurance" },
  "rental-agreement": { title: "Rental Agreement" },
  "marriage-affidavit": { title: "Marriage Affidavit" },
  "visa-purpose-bookings": {
    title: "Visa Purpose Bookings",
    description:
      "Get dummy flight and hotel documents for your visa application. No need to buy costly real tickets. Transparent pricing, 24-hour delivery.",
  },
};

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_MAP[slug];
  if (!service) return { title: "Service | JKV VisaXpress" };
  return {
    title: `${service.title} | JKV VisaXpress`,
    description:
      service.description ??
      `Request ${service.title} assistance. Fill out the form and our experts will contact you within 24 hours.`,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const service = SERVICE_MAP[normalizedSlug];

  if (!service) notFound();

  if (normalizedSlug === "visa-purpose-bookings") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main>
          <VisaPurposeBookingsPage />
        </main>
        <Footer />
      </div>
    );
  }

  const hasStepsLayout = normalizedSlug === "passport-renewal" || normalizedSlug === "rental-agreement";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-[#0b182c] via-[#1a2f45] to-[#0b182c] section-y">
          <div className="container">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-300">
              Need help with {service.title.toLowerCase()}? Fill out the form below and
              our team will get back to you within 24 hours.
            </p>
          </div>
        </section>

        <section className={`section-y ${hasStepsLayout ? "border-t border-gray-200 bg-[#F8F9FA]" : ""}`}>
          <div className="container">
            {normalizedSlug === "travel-insurance" ? (
              <div className="mx-auto max-w-2xl">
                <TravelInsuranceForm />
              </div>
            ) : normalizedSlug === "marriage-affidavit" ? (
              <div className="mx-auto max-w-2xl">
                <MarriageAffidavitForm />
              </div>
            ) : hasStepsLayout ? (
              <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                <ServiceRequestSteps
                  title={`Request ${service.title}`}
                  subtitle="Fill out the form below and our visa experts will get in touch with you within 24 hours to guide you through the next steps."
                  hideChooseService
                  provideDetailsDesc="Fill in the travellers details securely."
                />
                <ServiceRequestForm
                  defaultService={normalizedSlug}
                  serviceTitle={service.title}
                  fullWidth
                  standaloneCard
                />
              </div>
            ) : (
              <div className="mx-auto max-w-2xl">
                <ServiceRequestForm
                  defaultService={normalizedSlug}
                  serviceTitle={service.title}
                />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
