import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactPageWrapper } from "@/components/contact-page-wrapper";
import { AnimateInView } from "@/components/animate-in-view";
import { getCountries } from "@/lib/countries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | JKV VisaXpress",
  description:
    "Get in touch with JKV VisaXpress for visa assistance. Our experts are ready to help you with your application. Reach out within 24 hours.",
};

interface ContactPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const countries = await getCountries();
  const params = await searchParams;
  const defaultServiceFromServer = params.service === "refund-process" ? "refund-process" : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <Header applyNowHref="/contact#contact" />
      <main>
        <section className="bg-gradient-to-br from-[#0b182c] via-[#1a2f45] to-[#0b182c] py-20">
          <div className="container">
            <AnimateInView animation="fade-in-up">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                Contact Us
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-gray-300">
                Have questions about your visa application? Our team is here to
                help. Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </AnimateInView>
          </div>
        </section>

        <Suspense fallback={<div className="container py-16">
          <div className="mx-auto max-w-xl h-96 animate-pulse rounded-xl bg-gray-200" />
        </div>}>
          <ContactPageWrapper countries={countries} defaultServiceFromServer={defaultServiceFromServer} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
