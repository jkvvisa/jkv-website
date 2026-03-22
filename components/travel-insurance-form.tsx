"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConsentCheckboxField } from "@/components/consent-checkbox-field";
import { IndianPhoneField } from "@/components/indian-phone-field";
import { fullPhoneFromDigits, INDIAN_MOBILE_DIGITS_REGEX } from "@/lib/indian-phone";
import { cn } from "@/lib/utils";
import {
  calculateTotalQuote,
  formatCurrency,
} from "@/lib/insurance-quote";
import { Check, Shield, BadgePercent, Sparkles, Minus, Plus } from "lucide-react";
import type { ServiceOption } from "@/lib/service-types";
import type { LabelValueOption } from "@/lib/form-options";

const PAGE_SLUG = "travel-insurance";

function getDiscountPercent(count: number): number {
  if (count >= 6) return 20;
  if (count === 5) return 15;
  if (count >= 2) return 10;
  return 0;
}

interface Applicant {
  name: string;
  age: string;
}

export function TravelInsuranceForm() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [coverageOptions, setCoverageOptions] = useState<LabelValueOption[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [coverageError, setCoverageError] = useState<string | null>(null);
  const [serviceSlug, setServiceSlug] = useState(PAGE_SLUG);

  useEffect(() => {
    setServicesError(null);
    fetch("/api/services")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setServices([]);
          setServicesError(
            typeof data.error === "string" ? data.error : "Could not load services."
          );
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices([]);
          setServicesError("No services are available.");
        }
      })
      .catch(() => {
        setServices([]);
        setServicesError("Could not load services.");
      });

    setCoverageError(null);
    fetch("/api/insurance-coverage-options")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setCoverageOptions([]);
          setCoverageError(
            typeof data.error === "string" ? data.error : "Could not load coverage options."
          );
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setCoverageOptions(data);
        } else {
          setCoverageOptions([]);
          setCoverageError("No coverage options are configured.");
        }
      })
      .catch(() => {
        setCoverageOptions([]);
        setCoverageError("Could not load coverage options.");
      });
  }, []);

  const servicePickerOptions: LabelValueOption[] = services.map((s) => ({
    value: s.slug,
    label: s.name,
  }));

  const coverageSelectOptions = coverageOptions;

  const [numApplicants, setNumApplicants] = useState(1);
  const [applicants, setApplicants] = useState<Applicant[]>([{ name: "", age: "" }]);
  const [travelFrom, setTravelFrom] = useState("");
  const [travelTo, setTravelTo] = useState("");
  const [coverage, setCoverage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [quotedResult, setQuotedResult] = useState<{
    total: number;
    breakdown: { age: number; cost: number }[];
  } | null>(null);
  const [consent, setConsent] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState("");

  function updateApplicantsCount(count: number) {
    const n = Math.min(10, Math.max(1, count));
    setNumApplicants(n);
    setApplicants((prev) => {
      const next = [...prev];
      while (next.length < n) {
        next.push({ name: "", age: "" });
      }
      return next.slice(0, n);
    });
  }

  function updateApplicant(index: number, field: "name" | "age", value: string) {
    setApplicants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function validate(
    name: string,
    email: string,
    phoneDigitsValue: string,
    apps: Applicant[],
    from: string,
    to: string,
    cov: string,
    consentAccepted: boolean
  ): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phoneDigitsValue.trim()) newErrors.phone = "Phone number is required";
    else if (!INDIAN_MOBILE_DIGITS_REGEX.test(phoneDigitsValue)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!from) newErrors.travelFrom = "Travel start date is required";
    if (!to) newErrors.travelTo = "Travel end date is required";
    if (from && to && new Date(from) > new Date(to)) {
      newErrors.travelTo = "End date must be after start date";
    }
    if (!cov) newErrors.coverage = "Insurance coverage is required";
    apps.forEach((app, i) => {
      if (!app.name.trim()) newErrors[`applicant-${i}-name`] = "Applicant name is required";
      if (!app.age.trim()) newErrors[`applicant-${i}-age`] = "Applicant age is required";
      else if (isNaN(Number(app.age)) || Number(app.age) < 1 || Number(app.age) > 120) {
        newErrors[`applicant-${i}-age`] = "Please enter a valid age (1-120)";
      }
    });

    if (!consentAccepted) {
      newErrors.consent = "Please confirm your consent to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleGetQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!validate(name, email, phoneDigits, applicants, travelFrom, travelTo, coverage, consent)) {
      return;
    }

    const ages = applicants
      .map((a) => parseInt(a.age, 10))
      .filter((age) => !isNaN(age) && age >= 1 && age <= 74);
    if (ages.length !== applicants.length) {
      setErrors((prev) => ({
        ...prev,
        form: "Please enter valid ages (1-74) for all applicants to get a quote.",
      }));
      return;
    }

    const result = calculateTotalQuote(travelFrom, travelTo, ages, coverage);
    if (result.total === 0) {
      setErrors((prev) => ({
        ...prev,
        form: "Unable to calculate quote. Please check travel dates and applicant ages.",
      }));
      return;
    }

    setQuotedResult(result);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  return (
    <Card className="w-full max-w-xl border-0">
      <CardHeader>
        <h3 className="font-semibold">Get Travel Insurance Quote</h3>
        <p className="text-sm text-muted-foreground">
          Fill out the form and we&apos;ll provide you a quote immediately.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleGetQuote}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-[#1C2B3A]">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Rahul Sharma"
                aria-label="Full name"
                aria-invalid={!!errors.name}
                className={cn(
                  "bg-gray-100/70 border-gray-200/80",
                  errors.name && "border-red-500 focus-visible:ring-red-500"
                )}
                onBlur={() => clearError("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-[#1C2B3A]">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="rahul.sharma@gmail.com"
                aria-label="Email address"
                aria-invalid={!!errors.email}
                className={cn(
                  "bg-gray-100/70 border-gray-200/80",
                  errors.email && "border-red-500 focus-visible:ring-red-500"
                )}
                onBlur={() => clearError("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-bold text-[#1C2B3A]">
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
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="service" className="block text-sm font-bold text-[#1C2B3A]">
                Service Required
              </label>
              <Select
                value={serviceSlug}
                onValueChange={(v) => {
                  setServiceSlug(v);
                  if (v !== PAGE_SLUG) router.push(`/services/${v}`);
                }}
              >
                <SelectTrigger id="service" className="bg-gray-100/70 border-gray-200/80">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {servicePickerOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {servicesError && (
                <p className="text-sm text-amber-700">{servicesError}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-bold text-[#1C2B3A]">
              Number of applicants
            </span>
            <div className="flex max-w-[200px] items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 !rounded-full bg-gray-100/70 border-gray-200/80"
                disabled={numApplicants <= 1}
                onClick={() => updateApplicantsCount(numApplicants - 1)}
                aria-label="Decrease number of applicants"
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-[2.5rem] text-center text-lg font-semibold tabular-nums text-[#1C2B3A]">
                {numApplicants}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 !rounded-full bg-gray-100/70 border-gray-200/80"
                disabled={numApplicants >= 10}
                onClick={() => updateApplicantsCount(numApplicants + 1)}
                aria-label="Increase number of applicants"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-[#1C2B3A]">
              Applicant Details (Name & Age)
            </p>
            <div className="space-y-3">
              {applicants.map((app, i) => (
                <div
                  key={i}
                  className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4"
                >
                  <div className="flex-1 min-w-[140px] space-y-1">
                    <label
                      htmlFor={`applicant-${i}-name`}
                      className="block text-xs font-medium text-[#6B7280]"
                    >
                      Applicant {i + 1} Name
                    </label>
                    <Input
                      id={`applicant-${i}-name`}
                      placeholder="Full name"
                      value={app.name}
                      onChange={(e) => updateApplicant(i, "name", e.target.value)}
                      className={cn(
                        "bg-white border-gray-200/80",
                        errors[`applicant-${i}-name`] && "border-red-500"
                      )}
                      onBlur={() => clearError(`applicant-${i}-name`)}
                    />
                    {errors[`applicant-${i}-name`] && (
                      <p className="text-xs text-red-600">{errors[`applicant-${i}-name`]}</p>
                    )}
                  </div>
                  <div className="w-24 space-y-1">
                    <label
                      htmlFor={`applicant-${i}-age`}
                      className="block text-xs font-medium text-[#6B7280]"
                    >
                      Age
                    </label>
                    <Input
                      id={`applicant-${i}-age`}
                      type="number"
                      min={1}
                      max={120}
                      placeholder="Age"
                      value={app.age}
                      onChange={(e) => updateApplicant(i, "age", e.target.value)}
                      className={cn(
                        "bg-white border-gray-200/80",
                        errors[`applicant-${i}-age`] && "border-red-500"
                      )}
                      onBlur={() => clearError(`applicant-${i}-age`)}
                    />
                    {errors[`applicant-${i}-age`] && (
                      <p className="text-xs text-red-600">{errors[`applicant-${i}-age`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="coverage" className="block text-sm font-bold text-[#1C2B3A]">
              Insurance Coverage Required
            </label>
            <Select
              value={coverage}
              onValueChange={(v) => {
                setCoverage(v);
                clearError("coverage");
              }}
            >
              <SelectTrigger
                id="coverage"
                aria-label="Insurance coverage"
                aria-invalid={!!errors.coverage}
                className={cn(
                  "bg-gray-100/70 border-gray-200/80 max-w-[200px]",
                  errors.coverage && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="Select coverage" />
              </SelectTrigger>
              <SelectContent>
                {coverageSelectOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {coverageError && (
              <p className="text-sm text-amber-700">{coverageError}</p>
            )}
            {errors.coverage && (
              <p className="text-sm text-red-600">{errors.coverage}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-[#1C2B3A]">
              Travel Period (Insurance Coverage Dates)
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="travelFrom"
                  className="block text-xs font-medium text-[#6B7280]"
                >
                  From Date
                </label>
                <Input
                  id="travelFrom"
                  type="date"
                  value={travelFrom}
                  onChange={(e) => {
                    setTravelFrom(e.target.value);
                    clearError("travelFrom");
                  }}
                  className={cn(
                    "bg-gray-100/70 border-gray-200/80 max-w-[180px]",
                    errors.travelFrom && "border-red-500"
                  )}
                />
                {errors.travelFrom && (
                  <p className="text-sm text-red-600">{errors.travelFrom}</p>
                )}
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="travelTo"
                  className="block text-xs font-medium text-[#6B7280]"
                >
                  To Date
                </label>
                <Input
                  id="travelTo"
                  type="date"
                  value={travelTo}
                  onChange={(e) => {
                    setTravelTo(e.target.value);
                    clearError("travelTo");
                  }}
                  className={cn(
                    "bg-gray-100/70 border-gray-200/80 max-w-[180px]",
                    errors.travelTo && "border-red-500"
                  )}
                />
                {errors.travelTo && (
                  <p className="text-sm text-red-600">{errors.travelTo}</p>
                )}
              </div>
            </div>
          </div>

          {errors.form && (
            <p className="text-sm text-red-600">{errors.form}</p>
          )}
          {submitStatus === "success" && (
            <p className="text-sm text-green-600">
              Thank you! We&apos;ll send you a quote within 24 hours.
            </p>
          )}
          <ConsentCheckboxField
            id="travel-insurance-consent"
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
              !!servicesError ||
              !!coverageError ||
              services.length === 0 ||
              coverageOptions.length === 0
            }
          >
            Get Quote
          </Button>

          {quotedResult && quotedResult.total > 0 && (() => {
            const count = quotedResult.breakdown.length;
            const discountPercent = getDiscountPercent(count);
            const originalTotal = quotedResult.total;
            const discountedTotal =
              discountPercent > 0
                ? Math.round(originalTotal * (1 - discountPercent / 100))
                : originalTotal;
            const savings = originalTotal - discountedTotal;
            return (
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-primary/5 to-primary/10 shadow-lg shadow-primary/10">
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-primary/15 bg-primary/5 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1C2B3A]">Your Insurance Quote</h3>
                  <p className="text-xs text-[#6B7280]">
                    {count} applicant{count > 1 ? "s" : ""} · Instant quote · Valid for 24 hours
                  </p>
                </div>
              </div>

              <div className="space-y-1 p-5">
                {quotedResult.breakdown.length > 1 && (
                  <div className="mb-4 rounded-lg bg-gray-50/80 px-4 py-3">
                    <p className="text-xs font-medium text-[#6B7280]">Premium breakdown</p>
                    <p className="mt-1 text-sm text-[#1C2B3A]">
                      {quotedResult.breakdown
                        .map((b) => `Age ${b.age}: ${formatCurrency(b.cost)}`)
                        .join(" + ")}
                    </p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Original Price Card */}
                  <div className="flex flex-col rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-[#6B7280]">
                        Standard
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[#6B7280]">
                      Published premium as per our tariff. No group discount applied.
                    </p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-[#1C2B3A]">
                      {formatCurrency(originalTotal)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Inclusive of taxes & fees
                    </p>
                  </div>

                  {/* Discounted Price Card */}
                  <div className="relative flex flex-col overflow-hidden rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5 p-5 shadow-md shadow-primary/10">
                    {discountPercent > 0 && (
                      <div className="absolute right-3 top-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                          <BadgePercent className="h-3.5 w-3.5" />
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {discountPercent > 0 ? "Group discount" : "Best"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[#6B7280]">
                      {discountPercent > 0
                        ? `Special rate for ${count} travellers. Save more when you travel together!`
                        : "Your premium at this rate."}
                    </p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-primary">
                      {formatCurrency(discountedTotal)}
                    </p>
                    {discountPercent > 0 ? (
                      <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                        <Check className="h-4 w-4" />
                        You save {formatCurrency(savings)}
                      </p>
                    ) : (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Inclusive of taxes & fees
                      </p>
                    )}
                  </div>
                </div>

                {/* Trust badge */}
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-50/80 px-4 py-3">
                  <Shield className="h-4 w-4 text-primary/70" />
                  <p className="text-xs text-[#6B7280]">
                    Transparent pricing · No hidden charges · Instant confirmation
                  </p>
                </div>
              </div>

              <div className="border-t border-primary/10 bg-white/50 px-5 py-4">
              <Button
                type="button"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
                onClick={async () => {
                  if (!consent) {
                    setErrors((prev) => ({
                      ...prev,
                      consent: "Please confirm your consent to continue.",
                    }));
                    return;
                  }
                  const form = document.querySelector("form");
                  if (!form) return;
                  const formData = new FormData(form);
                  const name = formData.get("name") as string;
                  const email = formData.get("email") as string;
                  const phone = fullPhoneFromDigits(phoneDigits);
                  if (!phone) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "Please enter a valid 10-digit mobile number",
                    }));
                    return;
                  }
                  const applicantDetails = applicants
                    .map((a, i) => `Applicant ${i + 1}: ${a.name} (Age: ${a.age})`)
                    .join("; ");
                  const coverageLabel =
                    coverageSelectOptions.find((o) => o.value === coverage)?.label ?? coverage;
                  const travelInsuranceSvc = services.find((s) => s.slug === PAGE_SLUG);
                  const discountPct = getDiscountPercent(quotedResult.breakdown.length);
                  const finalTotal =
                    discountPct > 0
                      ? Math.round(quotedResult.total * (1 - discountPct / 100))
                      : quotedResult.total;
                  const purposeOfTravel = `Travel Insurance - ${applicants.length} applicant(s): ${applicantDetails}. Travel period: ${travelFrom} to ${travelTo}. Coverage: ${coverageLabel}. Original: ₹${quotedResult.total.toLocaleString("en-IN")}${discountPct > 0 ? `, ${discountPct}% off: ₹${finalTotal.toLocaleString("en-IN")}` : ""}`;
                  setIsSubmitting(true);
                  setSubmitStatus("idle");
                  try {
                    const res = await fetch("/api/leads", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        full_name: name.trim(),
                        email: email.trim(),
                        phone,
                        purpose_of_travel: purposeOfTravel,
                        country_id: null,
                        consent_accepted: consent,
                        service_id: travelInsuranceSvc?.id,
                        service_slug: PAGE_SLUG,
                        metadata: {
                          type: "travel_insurance_quote",
                          applicants,
                          travelFrom,
                          travelTo,
                          coverage,
                          coverageLabel,
                          quotedTotal: quotedResult.total,
                          discountPercent: discountPct,
                          finalTotal,
                        },
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setSubmitStatus("error");
                      setErrors((prev) => ({
                        ...prev,
                        form: data.error || "Failed to submit. Please try again.",
                      }));
                      return;
                    }
                    setSubmitStatus("success");
                    setErrors({});
                    form.reset();
                    setPhoneDigits("");
                    setNumApplicants(1);
                    setApplicants([{ name: "", age: "" }]);
                    setTravelFrom("");
                    setTravelTo("");
                    setCoverage("");
                    setQuotedResult(null);
                    setConsent(false);
                  } catch {
                    setSubmitStatus("error");
                    setErrors((prev) => ({
                      ...prev,
                      form: "Failed to submit. Please try again.",
                    }));
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
              </div>
            </div>
            );
          })()}
        </form>
      </CardContent>
    </Card>
  );
}
