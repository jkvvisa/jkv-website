"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableCountrySelect } from "@/components/searchable-country-select";
import { ConsentCheckboxField } from "@/components/consent-checkbox-field";
import { IndianPhoneField } from "@/components/indian-phone-field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CountryVisaData } from "@/lib/country-data";
import type { ServiceOption } from "@/lib/service-types";
import type { LabelValueOption } from "@/lib/form-options";
import { fullPhoneFromDigits, INDIAN_MOBILE_DIGITS_REGEX } from "@/lib/indian-phone";
import { cn } from "@/lib/utils";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ContactFormProps {
  countries?: CountryVisaData[];
  defaultCountryId?: string;
  onSuccess?: () => void;
  /** When true, shows Services Required dropdown (Contact page) instead of Purpose of Travel + Country */
  variant?: "default" | "contactPage";
  /** Preselected service when variant is contactPage (e.g. "refund-process") */
  defaultService?: string;
}

export function ContactForm({ countries: initialCountries = [], defaultCountryId, onSuccess, variant = "default", defaultService }: ContactFormProps) {
  const [countries, setCountries] = useState<CountryVisaData[]>(initialCountries);
  const [contactServices, setContactServices] = useState<ServiceOption[]>([]);
  const [visaPurposes, setVisaPurposes] = useState<LabelValueOption[]>([]);
  const [contactServicesError, setContactServicesError] = useState<string | null>(null);
  const [visaPurposesError, setVisaPurposesError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (variant !== "contactPage") return;
    setContactServicesError(null);
    fetch("/api/services")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setContactServices([]);
          setContactServicesError(
            typeof data.error === "string" ? data.error : "Could not load services."
          );
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setContactServices(data);
        } else {
          setContactServices([]);
          setContactServicesError("No services are available.");
        }
      })
      .catch(() => {
        setContactServices([]);
        setContactServicesError("Could not load services.");
      });
  }, [variant]);

  useEffect(() => {
    if (variant !== "default") return;
    setVisaPurposesError(null);
    fetch("/api/visa-purposes")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setVisaPurposes([]);
          setVisaPurposesError(
            typeof data.error === "string" ? data.error : "Could not load travel purposes."
          );
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setVisaPurposes(data);
        } else {
          setVisaPurposes([]);
          setVisaPurposesError("No travel purposes are configured.");
        }
      })
      .catch(() => {
        setVisaPurposes([]);
        setVisaPurposesError("Could not load travel purposes.");
      });
  }, [variant]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countryValue, setCountryValue] = useState<string>(defaultCountryId ?? "");
  const [purposeValue, setPurposeValue] = useState<string>("");

  useEffect(() => {
    if (defaultCountryId) setCountryValue(defaultCountryId);
  }, [defaultCountryId]);

  useEffect(() => {
    if (variant !== "contactPage" || !defaultService) return;
    const match = contactServices.find((s) => s.slug === defaultService);
    if (match) setPurposeValue(match.id);
  }, [variant, defaultService, contactServices]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [consent, setConsent] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState("");

  function validate(
    name: string,
    email: string,
    phoneDigitsValue: string,
    country: string,
    purpose: string,
    consentAccepted: boolean
  ): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phoneDigitsValue.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!INDIAN_MOBILE_DIGITS_REGEX.test(phoneDigitsValue)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    const hasCountriesWithId = countries.some((c) => c.id);
    if (variant === "default" && hasCountriesWithId && !country) {
      newErrors.country = "Please select a country";
    }

    if (!purpose) {
      newErrors.purpose = variant === "contactPage" ? "Please select a service" : "Please select a purpose of travel";
    }

    if (!consentAccepted) {
      newErrors.consent = "Please confirm your consent to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!validate(name, email, phoneDigits, countryValue, purposeValue, consent)) {
      return;
    }

    const phone = fullPhoneFromDigits(phoneDigits);

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const payload: Record<string, unknown> = {
        full_name: name.trim(),
        email: email.trim(),
        phone,
        consent_accepted: consent,
      };

      if (variant === "contactPage") {
        if (UUID_REGEX.test(purposeValue)) {
          payload.service_id = purposeValue;
        } else if (purposeValue) {
          payload.purpose_of_travel = purposeValue;
        }
      } else {
        payload.purpose_of_travel = purposeValue || null;
        payload.country_id = countryValue || null;
      }

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitStatus("error");
        setErrors((e) => ({ ...e, form: data.error || "Failed to submit. Please try again." }));
        return;
      }

      setSubmitStatus("success");
      setErrors({});
      setCountryValue("");
      setPurposeValue("");
      setConsent(false);
      setPhoneDigits("");
      form.reset();
      onSuccess?.();
    } catch {
      setSubmitStatus("error");
      setErrors((e) => ({ ...e, form: "Failed to submit. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearError(field: string) {
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  return (
    <Card className="w-full max-w-xl border-0 py-8">
      <CardHeader>
        <h3 className="font-semibold">Get in Touch</h3>
        <p className="text-sm text-muted-foreground">
          Fill out the form and our experts will contact you within 24 hours.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-bold text-[#1C2B3A]"
              >
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Rahul Sharma"
                aria-label="Full name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={cn(
                  "bg-gray-100/70 border-gray-200/80",
                  errors.name && "border-red-500 focus-visible:ring-red-500"
                )}
                onBlur={() => clearError("name")}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-[#1C2B3A]"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="rahul.sharma@gmail.com"
                aria-label="Email address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(
                  "bg-gray-100/70 border-gray-200/80",
                  errors.email && "border-red-500 focus-visible:ring-red-500"
                )}
                onBlur={() => clearError("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-bold text-[#1C2B3A]"
              >
                Phone Number
              </label>
              <IndianPhoneField
                id="phone"
                value={phoneDigits}
                onChange={(d) => {
                  setPhoneDigits(d);
                  clearError("phone");
                }}
                error={!!errors.phone}
                onBlur={() => clearError("phone")}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-sm text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>
            {variant === "default" ? (
              <div className="space-y-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-bold text-[#1C2B3A]"
                >
                  Country
                </label>
                <SearchableCountrySelect
                  id="country"
                  value={countryValue}
                  onValueChange={(v) => {
                    setCountryValue(v);
                    if (errors.country) setErrors((e) => ({ ...e, country: "" }));
                  }}
                  countries={countries}
                  placeholder="Select a country"
                  aria-label="Country"
                  aria-invalid={!!errors.country}
                  className={cn(errors.country && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.country && (
                  <p id="country-error" className="text-sm text-red-600">
                    {errors.country}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="purpose"
                  className="block text-sm font-bold text-[#1C2B3A]"
                >
                  Service Required
                </label>
                <Select
                  value={purposeValue || undefined}
                  onValueChange={(v) => {
                    setPurposeValue(v);
                    if (errors.purpose) setErrors((e) => ({ ...e, purpose: "" }));
                  }}
                >
                  <SelectTrigger
                    id="purpose"
                    aria-label="Service required"
                    aria-invalid={!!errors.purpose}
                    className={cn(
                      "bg-gray-100/70 border-gray-200/80",
                      errors.purpose && "border-red-500 focus-visible:ring-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactServices.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {contactServicesError && (
                  <p className="text-sm text-amber-700">{contactServicesError}</p>
                )}
                {errors.purpose && (
                  <p id="purpose-error" className="text-sm text-red-600">
                    {errors.purpose}
                  </p>
                )}
              </div>
            )}
          </div>
          {variant === "default" && (
            <div className="space-y-2">
              <label
                htmlFor="purpose"
                className="block text-sm font-bold text-[#1C2B3A]"
              >
                Purpose of Travel
              </label>
              <Select
                value={purposeValue || undefined}
                onValueChange={(v) => {
                  setPurposeValue(v);
                  if (errors.purpose) setErrors((e) => ({ ...e, purpose: "" }));
                }}
              >
                <SelectTrigger
                  id="purpose"
                  aria-label="Purpose of travel"
                  aria-invalid={!!errors.purpose}
                  className={cn(
                    "bg-gray-100/70 border-gray-200/80",
                    errors.purpose && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  <SelectValue placeholder="Select a purpose" />
                </SelectTrigger>
                <SelectContent>
                  {visaPurposes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {visaPurposesError && (
                <p className="text-sm text-amber-700">{visaPurposesError}</p>
              )}
              {errors.purpose && (
                <p id="purpose-error" className="text-sm text-red-600">
                  {errors.purpose}
                </p>
              )}
            </div>
          )}
          {errors.form && (
            <p className="text-sm text-red-600">{errors.form}</p>
          )}
          {submitStatus === "success" && (
            <p className="text-sm text-green-600">
              Thank you! Our experts will contact you within 24 hours.
            </p>
          )}
          <ConsentCheckboxField
            id="contact-consent"
            checked={consent}
            onChange={(v) => {
              setConsent(v);
              if (v) clearError("consent");
            }}
            error={errors.consent}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={
              isSubmitting ||
              (variant === "contactPage" &&
                (contactServices.length === 0 || !!contactServicesError)) ||
              (variant === "default" && (!!visaPurposesError || visaPurposes.length === 0))
            }
          >
            {isSubmitting ? "Submitting..." : "Apply Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
