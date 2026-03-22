import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrendingDestinations } from "@/components/trending-destinations";
import { PremiumServices } from "@/components/premium-services";
import { ApplicationProcess } from "@/components/application-process";
import { ContactSection } from "@/components/contact-section";
import { WhyChooseUs } from "@/components/why-choose-us";
import { HowWeAreDifferent } from "@/components/how-we-are-different";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header applyNowHref="/#contact" />
      <main>
        <Hero />
        <TrendingDestinations />
        <PremiumServices />
        <ApplicationProcess />
        <WhyChooseUs />
        <HowWeAreDifferent />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
