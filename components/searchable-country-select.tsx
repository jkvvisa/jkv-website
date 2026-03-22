"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { CountryVisaData } from "@/lib/country-data";
import { cn } from "@/lib/utils";

interface SearchableCountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  countries: CountryVisaData[];
  placeholder?: string;
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  className?: string;
}

export function SearchableCountrySelect({
  value,
  onValueChange,
  countries,
  placeholder = "Select a country",
  id,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  className,
}: SearchableCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const countriesWithId = countries.filter((c) => c.id || c.slug);
  const filteredCountries = search.trim()
    ? countriesWithId.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : countriesWithId;

  const selectedCountry = countriesWithId.find(
    (c) => (c.id ?? c.slug) === value
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          "bg-gray-100/70 border-gray-200/80",
          ariaInvalid && "border-red-500 focus-visible:ring-red-500",
          className
        )}
      >
        <span className={!selectedCountry ? "text-muted-foreground" : ""}>
          {selectedCountry?.name ?? placeholder}
        </span>
        <ChevronDown
          className={cn("size-4 opacity-50 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-72 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
          role="listbox"
        >
          <div className="border-b p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                }}
                className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredCountries.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country) => {
                const countryValue = country.id ?? country.slug ?? "";
                return (
                  <button
                    key={countryValue}
                    type="button"
                    role="option"
                    aria-selected={value === countryValue}
                    onClick={() => {
                      onValueChange(countryValue);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-3 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      value === countryValue && "bg-accent/50"
                    )}
                  >
                    {country.name}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
