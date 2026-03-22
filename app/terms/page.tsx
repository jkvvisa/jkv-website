import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateInView } from "@/components/animate-in-view";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | JKV VisaXpress",
  description:
    "Terms and conditions for using JKV VisaXpress visa assistance services and website.",
};

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "communications", label: "Communications" },
  { id: "appointments", label: "Appointments" },
  { id: "fraud", label: "Fraud awareness" },
  { id: "refunds-changes", label: "Refunds & changes" },
] as const;

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-[#0b182c] via-[#1a2f45] to-[#0b182c] section-y">
          <div className="container">
            <AnimateInView animation="fade-in-up">
              <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="hover:text-gray-300">
                  Home
                </Link>
                <ChevronRight className="size-4" aria-hidden />
                <span className="text-white font-medium">Terms and Conditions</span>
              </nav>
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                Terms and Conditions
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-300">
                Please read these terms before using JKV VisaXpress services or this website.
              </p>
            </AnimateInView>
          </div>
        </section>

        <section className="container section-y">
          <AnimateInView animation="fade-in-up">
            <p className="text-center text-sm font-medium text-[#1F2937]">On this page</p>
            <p className="mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm text-primary">
              {sections.map((s, i) => (
                <span key={s.id} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-[#D1D5DB]" aria-hidden>·</span>}
                  <a href={`#${s.id}`} className="hover:underline">
                    {s.label}
                  </a>
                </span>
              ))}
            </p>
          </AnimateInView>

          <div className="mt-12 space-y-12">
            <AnimateInView animation="fade-in-up">
              <h2
                id="introduction"
                className="scroll-mt-24 text-center text-xl font-bold text-[#1F2937] md:text-2xl"
              >
                Introduction
              </h2>
              <div className="mt-6 w-full max-w-none space-y-4">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  JKV VisaXpress provides visa assistance and related services to help you prepare and
                  submit applications. By using this website or our services, you agree to these Terms
                  and Conditions.
                </p>
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  We may update these terms from time to time. Please check this page periodically;
                  continued use after changes means you accept the updated terms.
                </p>
              </div>
            </AnimateInView>

            <AnimateInView animation="fade-in-up">
              <h2
                id="communications"
                className="scroll-mt-24 text-center text-xl font-bold text-[#1F2937] md:text-2xl"
              >
                Communications
              </h2>
              <div className="mt-6 w-full max-w-none">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  We may contact you by email, phone, or SMS (where you have agreed or where needed
                  for your application) with updates or reminders. Delivery can depend on networks and
                  providers; we are not liable for delays or failures outside our reasonable control.
                </p>
              </div>
            </AnimateInView>

            <AnimateInView animation="fade-in-up">
              <h2
                id="appointments"
                className="scroll-mt-24 text-center text-xl font-bold text-[#1F2937] md:text-2xl"
              >
                Appointments
              </h2>
              <div className="mt-6 w-full max-w-none">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  Embassies or visa centres may require you to attend an appointment or interview. We
                  may help you schedule or coordinate such steps where that forms part of your
                  service. Final decisions on visas rest with the relevant government authority, not
                  with JKV VisaXpress.
                </p>
              </div>
            </AnimateInView>

            <AnimateInView animation="fade-in-up">
              <h2
                id="fraud"
                className="scroll-mt-24 text-center text-xl font-bold text-[#1F2937] md:text-2xl"
              >
                Fraud awareness
              </h2>
              <div className="mt-6 w-full max-w-none">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  Be cautious of unsolicited messages asking for money, bank details, or personal
                  data in exchange for visas or jobs. JKV VisaXpress does not guarantee visa approval
                  and does not recruit through informal channels or charge fees for employment. If
                  something looks suspicious, contact us only through the details on our official
                  website.
                </p>
              </div>
            </AnimateInView>

            <AnimateInView animation="fade-in-up">
              <h2
                id="refunds-changes"
                className="scroll-mt-24 text-center text-xl font-bold text-[#1F2937] md:text-2xl"
              >
                Refunds and changes
              </h2>
              <div className="mt-6 w-full max-w-none">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  Service fee refunds, where applicable, follow our{" "}
                  <Link href="/refund" className="font-medium text-primary hover:underline">
                    Refund Policy
                  </Link>
                  . We may change our services, fees, or these terms; material updates will be
                  reflected on this page.
                </p>
              </div>
            </AnimateInView>

            <AnimateInView animation="fade-in-up">
              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  Questions? Email{" "}
                  <a
                    href="mailto:docs@jkvvisaxpress.com"
                    className="font-medium text-primary hover:underline"
                  >
                    docs@jkvvisaxpress.com
                  </a>{" "}
                  or{" "}
                  <Link href="/contact" className="font-medium text-primary hover:underline">
                    contact us
                  </Link>
                  .
                </p>
              </div>
            </AnimateInView>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
