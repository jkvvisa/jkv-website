import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateInView } from "@/components/animate-in-view";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | JKV VisaXpress",
  description:
    "JKV VisaXpress refund policy. Understand our service fee refund conditions, eligibility, and processing timeline.",
};

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0b182c] via-[#1a2f45] to-[#0b182c] py-16">
          <div className="container">
            <AnimateInView animation="fade-in-up">
              <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="hover:text-gray-300">
                  Home
                </Link>
                <ChevronRight className="size-4" aria-hidden />
                <span className="text-white font-medium">Refund Policy</span>
              </nav>
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                Refund Policy
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-300">
                JKV VisaXpress&apos;s refund policy applies to service fees collected for visa assistance. Please read the terms below.
              </p>
            </AnimateInView>
          </div>
        </section>

        {/* Content */}
        <section className="container py-16">
          <div className="space-y-12">
            {/* Intro */}
            <AnimateInView animation="fade-in-up">
              <h2 className="text-center text-xl font-bold text-[#1F2937] md:text-2xl">
                JKV VisaXpress Refund Policy
              </h2>
              <div className="mt-6 w-full max-w-none">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  This policy covers service fees charged by JKV VisaXpress for visa processing assistance. Embassy or consular fees are paid directly to the government and are{" "}
                  <strong className="text-[#1F2937]">non-refundable</strong>. By using our services, you agree to these terms.
                </p>
              </div>
            </AnimateInView>

            {/* General Refund Conditions */}
            <AnimateInView animation="fade-in-up">
              <h2 className="text-center text-xl font-bold text-[#1F2937] md:text-2xl">
                General Refund Conditions
              </h2>
              <div className="mt-6 w-full max-w-none">
                <ol className="list-decimal space-y-3 pl-6 text-left text-base leading-relaxed text-[#6B7280]">
                  <li>Applicants must review this Refund Policy before availing our services.</li>
                  <li>Service fees may be refundable subject to the terms and conditions stated herein.</li>
                  <li>We will process refund requests as soon as reasonably practicable. Processing time depends on your payment method.</li>
                  <li>Submission of a refund request does not guarantee approval; we may reject requests that do not meet eligibility criteria.</li>
                  <li>Any transaction or administrative charges incurred during refund processing will be deducted from the refund amount.</li>
                  <li>Visa documents related shipping charges are non refundable.</li>
                </ol>
              </div>
            </AnimateInView>

            {/* Refund Eligibility Criteria */}
            <AnimateInView animation="fade-in-up">
              <h2 className="text-center text-xl font-bold text-[#1F2937] md:text-2xl">
                Refund Eligibility Criteria
              </h2>
              <div className="mt-6 w-full max-w-none space-y-4">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  Refunds will not be accepted in the following cases:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-left text-base leading-relaxed text-[#6B7280]">
                  <li>You have partially used our service (e.g., documents already submitted).</li>
                  <li>You missed your scheduled appointment.</li>
                  <li>You failed to provide all necessary documents as requested.</li>
                  <li>You decided not to proceed with your application after completion of the process.</li>
                  <li>You missed or cancelled your appointment within 2 days of your visa appointment.</li>
                </ul>
              </div>
            </AnimateInView>

            {/* Refund Processing Timeline */}
            <AnimateInView animation="fade-in-up">
              <h2 className="text-center text-xl font-bold text-[#1F2937] md:text-2xl">
                Refund Processing Timeline
              </h2>
              <div className="mt-6 w-full max-w-none">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  Approved refunds for service fees are typically processed within <strong className="text-[#1F2937]">48 to 72 hours</strong> or more, subject to the terms and conditions stated herein.
                </p>
              </div>
            </AnimateInView>

            {/* Receiving Your Refund */}
            <AnimateInView animation="fade-in-up">
              <h2 className="text-center text-xl font-bold text-[#1F2937] md:text-2xl">
                Receiving Your Refund
              </h2>
              <div className="mt-6 w-full max-w-none">
                <ul className="list-disc space-y-2 pl-6 text-left text-base leading-relaxed text-[#6B7280]">
                  <li>Refunds will be credited to the original payment method or by bank transfer/cheque as applicable.</li>
                  <li>We will notify you when your refund has been approved and processed.</li>
                  <li>For card payments, the refund will reflect in your account as per your bank&apos;s processing timeline.</li>
                </ul>
              </div>
            </AnimateInView>

            {/* CTA */}
            <AnimateInView animation="fade-in-up">
              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-left text-base leading-relaxed text-[#6B7280] md:text-justify">
                  For refund requests or questions, please{" "}
                  <Link href="/contact?service=refund-process" className="font-medium text-primary hover:underline">
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
