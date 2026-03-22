"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Globe, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CountryOption {
  name: string;
  slug: string;
  flagCode: string;
}

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function goToCountry(slug: string) {
    setFocused(false);
    setShowDropdown(false);
    setQuery("");
    router.push(`/${slug}`);
  }

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/countries?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: CountryOption[]) => {
        setResults(data);
        setShowDropdown(true);
      })
      .catch(() => {
        setResults([]);
        setShowDropdown(false);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayDropdown = showDropdown && focused && query.length >= 3;

  return (
    <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg">
      <div ref={wrapperRef} className="w-full">
        <div className="relative w-full">
          <Globe
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Destination Country"
            className="h-14 border-0 bg-transparent pl-12 pr-10 text-base shadow-none focus-visible:ring-0"
            aria-label="Destination country"
            aria-expanded={displayDropdown}
            aria-autocomplete="list"
            role="combobox"
          />
          {loading && (
            <Loader2
              className="absolute right-4 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-hidden
            />
          )}
        </div>

        {displayDropdown && (
          <ul
            className="mt-2 max-h-52 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-md"
            role="listbox"
          >
            {results.length === 0 && !loading ? (
              <li className="px-4 py-3 text-sm text-[#6B7280]" role="presentation">
                No matches found
              </li>
            ) : results.length > 0 ? (
              results.map((country) => (
                <li key={country.slug} role="option">
                  <Link
                    href={`/${country.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1F2937] hover:bg-gray-100"
                    onMouseDown={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      goToCountry(country.slug);
                    }}
                  >
                    <span className="relative h-7 w-9 shrink-0 overflow-hidden rounded border border-gray-200 bg-muted/40">
                      <Image
                        src={`https://flagcdn.com/w80/${country.flagCode}.png`}
                        alt=""
                        width={36}
                        height={28}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="min-w-0">{country.name}</span>
                  </Link>
                </li>
              ))
            ) : null}
          </ul>
        )}
      </div>
    </div>
  );
}
