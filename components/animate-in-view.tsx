"use client";

import { useRef, useEffect, useState } from "react";

interface AnimateInViewProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in-up" | "fade-in" | "scale-in";
  delay?: number;
}

export function AnimateInView({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  const animationClass =
    animation === "fade-in"
      ? "animate-fade-in"
      : animation === "scale-in"
        ? "animate-scale-in"
        : "animate-fade-in-up";

  const delayClass =
    delay === 0
      ? ""
      : delay <= 100
        ? "animation-delay-100"
        : delay <= 200
          ? "animation-delay-200"
          : delay <= 300
            ? "animation-delay-300"
            : delay <= 400
              ? "animation-delay-400"
              : delay <= 500
                ? "animation-delay-500"
                : delay <= 600
                  ? "animation-delay-600"
                  : delay <= 700
                    ? "animation-delay-700"
                    : "animation-delay-800";

  // During SSR and initial hydration: render with opacity-0 only (no animation classes)
  // to avoid hydration mismatch. Animation runs after mount.
  const resolvedClass = !mounted
    ? `opacity-0 ${className}`.trim()
    : `${visible ? animationClass : "opacity-0"} ${delay > 0 ? delayClass : ""} ${className}`.trim();

  return (
    <div ref={ref} className={resolvedClass} suppressHydrationWarning>
      {children}
    </div>
  );
}
