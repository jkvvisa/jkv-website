import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhyChooseUs } from "@/components/why-choose-us";
import { HowWeAreDifferent } from "@/components/how-we-are-different";
import { AnimateInView } from "@/components/animate-in-view";
import { Target, Heart, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | JKV VisaXpress",
  description:
    "Learn about JKV VisaXpress – your trusted partner for fast, secure, and reliable visa processing. We make global travel accessible for everyone.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-[#0b182c] via-[#1a2f45] to-[#0b182c] py-20">
          <div className="container">
            <AnimateInView animation="fade-in-up">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                About JKV VisaXpress
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-gray-300">
                Leading the way in digital visa processing, we make global travel
                accessible, safe, and efficient for everyone.
              </p>
            </AnimateInView>
          </div>
        </section>

        <section className="container py-16">
          <AnimateInView animation="fade-in-up">
            <h2 className="text-center text-2xl font-bold text-[#212B36] md:text-3xl">
              Our Story
            </h2>
            <div className="mt-6 w-full max-w-none space-y-4">
              <p className="text-left text-base leading-relaxed text-[#637381] md:text-justify">
                JKV VisaXpress was founded with a simple mission: to simplify the
                visa application process and help travelers explore the world
                without hassle. We combine technology with human expertise to
                deliver fast, transparent, and reliable visa solutions for over 30
                countries.
              </p>
              <p className="text-left text-base leading-relaxed text-[#637381] md:text-justify">
                Our team of visa specialists works around the clock to ensure your
                application is handled with care. From document verification to
                submission support, we guide you through every step of the journey.
              </p>
            </div>
          </AnimateInView>
        </section>

        <section className="bg-[#F4F6F8] py-16">
          <div className="container">
            <AnimateInView animation="fade-in-up">
              <h2 className="mb-10 text-center text-2xl font-bold text-[#212B36] md:text-3xl">
                Our Values
              </h2>
            </AnimateInView>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <Target className="size-7 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-[#212B36]">Accuracy</h3>
                <p className="mt-2 text-sm text-[#637381]">
                  We ensure every application meets embassy requirements before submission.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="size-7 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-[#212B36]">Speed</h3>
                <p className="mt-2 text-sm text-[#637381]">
                  Fast processing and quick turnaround so you can travel sooner.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="size-7 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-[#212B36]">Security</h3>
                <p className="mt-2 text-sm text-[#637381]">
                  Enterprise-grade protection for your personal documents and data.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="size-7 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-[#212B36]">Care</h3>
                <p className="mt-2 text-sm text-[#637381]">
                  Dedicated support and personalized guidance for every traveler.
                </p>
              </div>
            </div>
          </div>
        </section>

        <WhyChooseUs />
        <HowWeAreDifferent />
      </main>
      <Footer />
    </div>
  );
}
