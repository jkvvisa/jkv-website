import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from "lucide-react";

const serviceLinks = [
  { href: "/destinations", label: "Visa Assistance" },
  { href: "/services/passport-renewal", label: "Passport Renewal" },
  { href: "/services/travel-insurance", label: "Travel Insurance" },
  { href: "/services/visa-purpose-bookings", label: "Visa Purpose Bookings" },
  { href: "/services/rental-agreement", label: "Rental Agreement" },
  { href: "/services/marriage-affidavit", label: "Marriage Affidavit" },
];

const supportLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/terms", label: "Terms and Conditions" },
];

const subtextClass = "text-base font-normal text-[#6B7280] hover:text-[#1A2B3D]";

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="container pl-8 pr-2 py-8 lg:pr-4">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1 flex flex-col items-center gap-0 leading-none">
            <Link href="/" prefetch className="flex justify-center p-0 [&_img]:block [&_img]:align-top">
              <Image
                src="/jkv-visaxpress-logo.png"
                alt="JKV VisaXpress"
                width={400}
                height={140}
                className="block w-full max-w-[260px] h-auto object-contain align-top"
              />
            </Link>
            <p className="mt-0 pt-0 text-base font-normal text-[#6B7280] max-w-[260px] text-left">
              Leading the way in digital visa processing, we make global travel
              accessible, safe, and efficient for everyone.
            </p>
          </div>

          <div className="text-base">
            <h3 className="font-bold text-[#1A2B3D]">Services</h3>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch className={subtextClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-base">
            <h3 className="font-bold text-[#1A2B3D]">Support</h3>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch className={subtextClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-[280px] max-w-[400px] justify-self-start -ml-8 lg:-ml-12 text-base">
            <h3 className="font-bold text-[#1A2B3D]">Contact Info</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="mailto:docs@jkvvisaxpress.com"
                  className={`flex items-center gap-2 ${subtextClass}`}
                >
                  <Mail className="size-4 shrink-0 text-[#6B7280]" aria-hidden />
                  docs@jkvvisaxpress.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918147311150"
                  className={`flex items-center gap-2 ${subtextClass}`}
                >
                  <Phone className="size-4 shrink-0 text-[#6B7280]" aria-hidden />
                  +91 8147311150
                </a>
              </li>
              <li>
                <span className={`flex items-start gap-2 text-base font-normal text-[#6B7280]`}>
                  <MapPin className="size-4 shrink-0 mt-0.5 text-[#6B7280]" aria-hidden />
                  <span className="min-w-0">
                    No 221, Sadha Shiva Mudaliar Road, Murphy Town, Halasuru, Bengaluru, 560008
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 JKV VisaXpress. All rights reserved.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label={link.label}
              >
                <link.icon className="size-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
