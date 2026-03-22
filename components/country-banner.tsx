"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=600&fit=crop";

interface CountryBannerProps {
  images: string[];
  children: React.ReactNode;
}

export function CountryBanner({ images, children }: CountryBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayImages =
    images?.length > 0 ? images : [DEFAULT_BANNER];

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <section className="relative aspect-[3/1] min-h-[280px] w-full overflow-hidden md:aspect-[21/6] md:min-h-[320px]">
      {displayImages.map((src, i) => (
        <div
          key={src + i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === activeIndex ? "z-0 opacity-100" : "z-0 opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#0b182c]/85 via-[#1a2f45]/75 to-[#0b182c]/85" />
      <div className="container relative z-20 flex h-full flex-col justify-center section-y">
        {children}
      </div>
    </section>
  );
}
