"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { ServiceOption } from "@/lib/service-types";
import type { LabelValueOption } from "@/lib/form-options";

const PAGE_SLUG = "marriage-affidavit";

export function MarriageAffidavitForm() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [marriageRitesList, setMarriageRitesList] = useState<LabelValueOption[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [ritesError, setRitesError] = useState<string | null>(null);
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

    setRitesError(null);
    fetch("/api/marriage-rites")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setMarriageRitesList([]);
          setRitesError(
            typeof data.error === "string" ? data.error : "Could not load marriage rites."
          );
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setMarriageRitesList(data);
        } else {
          setMarriageRitesList([]);
          setRitesError("No marriage rites are configured.");
        }
      })
      .catch(() => {
        setMarriageRitesList([]);
        setRitesError("Could not load marriage rites.");
      });
  }, []);

  const servicePickerOptions: LabelValueOption[] = services.map((s) => ({
    value: s.slug,
    label: s.name,
  }));

  const ritesOptions = marriageRitesList;
  const [husbandName, setHusbandName] = useState("");
  const [husbandFatherName, setHusbandFatherName] = useState("");
  const [wifeName, setWifeName] = useState("");
  const [wifeFatherName, setWifeFatherName] = useState("");
  const [residenceAddress, setResidenceAddress] = useState("");
  const [dateOfMarriage, setDateOfMarriage] = useState("");
  const [venueOfMarriage, setVenueOfMarriage] = useState("");
  const [marriageRites, setMarriageRites] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhoneDigits, setContactPhoneDigits] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [consent, setConsent] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!husbandName.trim()) newErrors.husbandName = "Husband's full name is required";
    if (!husbandFatherName.trim()) newErrors.husbandFatherName = "Husband's father name is required";
    if (!wifeName.trim()) newErrors.wifeName = "Wife's full name is required";
    if (!wifeFatherName.trim()) newErrors.wifeFatherName = "Wife's father name is required";
    if (!residenceAddress.trim()) newErrors.residenceAddress = "Current residence address is required";
    if (!dateOfMarriage.trim()) newErrors.dateOfMarriage = "Date of marriage is required";
    if (!venueOfMarriage.trim()) newErrors.venueOfMarriage = "Venue of marriage is required";
    if (!marriageRites) newErrors.marriageRites = "Please select marriage rites";
    if (!contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!contactEmail.trim()) newErrors.contactEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }
    if (!contactPhoneDigits.trim()) newErrors.contactPhone = "Phone number is required";
    else if (!INDIAN_MOBILE_DIGITS_REGEX.test(contactPhoneDigits)) {
      newErrors.contactPhone = "Please enter a valid 10-digit mobile number";
    }

    if (!consent) {
      newErrors.consent = "Please confirm your consent to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const ritesLabel = ritesOptions.find((o) => o.value === marriageRites)?.label ?? marriageRites;
    const marriageSvc = services.find((s) => s.slug === PAGE_SLUG);
    const purposeText = [
      `Marriage Affidavit`,
      `Husband: ${husbandName}, Father: ${husbandFatherName}`,
      `Wife: ${wifeName}, Father: ${wifeFatherName}`,
      `Residence: ${residenceAddress}`,
      `Date of marriage: ${dateOfMarriage}`,
      `Venue: ${venueOfMarriage}`,
      `Married according to: ${ritesLabel}`,
    ].join(" | ");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: contactName.trim(),
          email: contactEmail.trim(),
          phone: fullPhoneFromDigits(contactPhoneDigits),
          purpose_of_travel: purposeText,
          country_id: null,
          consent_accepted: consent,
          service_id: marriageSvc?.id,
          service_slug: PAGE_SLUG,
          metadata: {
            form: "marriage_affidavit",
            husbandName,
            husbandFatherName,
            wifeName,
            wifeFatherName,
            residenceAddress,
            dateOfMarriage,
            venueOfMarriage,
            marriageRites,
            ritesLabel,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitStatus("error");
        setErrors((prev) => ({ ...prev, form: data.error || "Failed to submit. Please try again." }));
        return;
      }

      setSubmitStatus("success");
      setErrors({});
      setHusbandName("");
      setHusbandFatherName("");
      setWifeName("");
      setWifeFatherName("");
      setResidenceAddress("");
      setDateOfMarriage("");
      setVenueOfMarriage("");
      setMarriageRites("");
      setContactName("");
      setContactEmail("");
      setContactPhoneDigits("");
      setConsent(false);
    } catch {
      setSubmitStatus("error");
      setErrors((prev) => ({ ...prev, form: "Failed to submit. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  const inputClass = "bg-gray-100/70 border-gray-200/80";
  const errorInputClass = "border-red-500 focus-visible:ring-red-500";

  return (
    <Card className="w-full max-w-xl border-0 bg-transparent shadow-none md:bg-card md:shadow-sm">
      <CardHeader className="p-0 md:p-6">
        <h3 className="font-semibold">Marriage Affidavit</h3>
        <p className="text-sm text-muted-foreground">
          Fill out the form and our experts will contact you within 24 hours to finalize the documentation.
        </p>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Husband Details */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
            <h4 className="font-semibold text-[#1C2B3A]">Husband Details</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="husbandName" className="block text-sm font-bold text-[#1C2B3A]">
                  Husband&apos;s Name
                </label>
                <Input
                  id="husbandName"
                  value={husbandName}
                  onChange={(e) => {
                    setHusbandName(e.target.value);
                    clearError("husbandName");
                  }}
                  placeholder="Enter full name"
                  className={cn(inputClass, errors.husbandName && errorInputClass)}
                />
                {errors.husbandName && (
                  <p className="text-sm text-red-600">{errors.husbandName}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="husbandFatherName" className="block text-sm font-bold text-[#1C2B3A]">
                  Father&apos;s Name
                </label>
                <Input
                  id="husbandFatherName"
                  value={husbandFatherName}
                  onChange={(e) => {
                    setHusbandFatherName(e.target.value);
                    clearError("husbandFatherName");
                  }}
                  placeholder="Enter father's full name"
                  className={cn(inputClass, errors.husbandFatherName && errorInputClass)}
                />
                {errors.husbandFatherName && (
                  <p className="text-sm text-red-600">{errors.husbandFatherName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Wife Details */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
            <h4 className="font-semibold text-[#1C2B3A]">Wife Details</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="wifeName" className="block text-sm font-bold text-[#1C2B3A]">
                  Wife&apos;s Name
                </label>
                <Input
                  id="wifeName"
                  value={wifeName}
                  onChange={(e) => {
                    setWifeName(e.target.value);
                    clearError("wifeName");
                  }}
                  placeholder="Enter full name"
                  className={cn(inputClass, errors.wifeName && errorInputClass)}
                />
                {errors.wifeName && (
                  <p className="text-sm text-red-600">{errors.wifeName}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="wifeFatherName" className="block text-sm font-bold text-[#1C2B3A]">
                  Father&apos;s Name
                </label>
                <Input
                  id="wifeFatherName"
                  value={wifeFatherName}
                  onChange={(e) => {
                    setWifeFatherName(e.target.value);
                    clearError("wifeFatherName");
                  }}
                  placeholder="Enter father's full name"
                  className={cn(inputClass, errors.wifeFatherName && errorInputClass)}
                />
                {errors.wifeFatherName && (
                  <p className="text-sm text-red-600">{errors.wifeFatherName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Marriage & Residence Details */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
            <h4 className="font-semibold text-[#1C2B3A]">Marriage & Residence Details</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="residenceAddress" className="block text-sm font-bold text-[#1C2B3A]">
                  Current Place of Residence in Karnataka
                </label>
                <Textarea
                  id="residenceAddress"
                  value={residenceAddress}
                  onChange={(e) => {
                    setResidenceAddress(e.target.value);
                    clearError("residenceAddress");
                  }}
                  placeholder="Enter complete address"
                  rows={3}
                  className={cn(inputClass, errors.residenceAddress && errorInputClass)}
                />
                {errors.residenceAddress && (
                  <p className="text-sm text-red-600">{errors.residenceAddress}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="dateOfMarriage" className="block text-sm font-bold text-[#1C2B3A]">
                    Date of Marriage
                  </label>
                  <Input
                    id="dateOfMarriage"
                    type="date"
                    value={dateOfMarriage}
                    onChange={(e) => {
                      setDateOfMarriage(e.target.value);
                      clearError("dateOfMarriage");
                    }}
                    className={cn(
                      "date-input-end w-full",
                      inputClass,
                      errors.dateOfMarriage && errorInputClass
                    )}
                  />
                  {errors.dateOfMarriage && (
                    <p className="text-sm text-red-600">{errors.dateOfMarriage}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="venueOfMarriage" className="block text-sm font-bold text-[#1C2B3A]">
                    Venue of Marriage
                  </label>
                  <Input
                    id="venueOfMarriage"
                    value={venueOfMarriage}
                    onChange={(e) => {
                      setVenueOfMarriage(e.target.value);
                      clearError("venueOfMarriage");
                    }}
                    placeholder="Enter venue of marriage"
                    className={cn(inputClass, errors.venueOfMarriage && errorInputClass)}
                  />
                  {errors.venueOfMarriage && (
                    <p className="text-sm text-red-600">{errors.venueOfMarriage}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="marriageRites" className="block text-sm font-bold text-[#1C2B3A]">
                  Marriage Rites
                </label>
                <Select
                  value={marriageRites}
                  onValueChange={(v) => {
                    setMarriageRites(v);
                    clearError("marriageRites");
                  }}
                >
                  <SelectTrigger
                    id="marriageRites"
                    className={cn(inputClass, errors.marriageRites && errorInputClass)}
                  >
                    <SelectValue placeholder="Select marriage rites" />
                  </SelectTrigger>
                  <SelectContent>
                    {ritesOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {ritesError && (
                  <p className="text-sm text-amber-700">{ritesError}</p>
                )}
                {errors.marriageRites && (
                  <p className="text-sm text-red-600">{errors.marriageRites}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="contactName" className="block text-sm font-bold text-[#1C2B3A]">
                Full Name
              </label>
              <Input
                id="contactName"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  clearError("contactName");
                }}
                placeholder="Rahul Sharma"
                className={cn(inputClass, errors.contactName && errorInputClass)}
              />
              {errors.contactName && (
                <p className="text-sm text-red-600">{errors.contactName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="block text-sm font-bold text-[#1C2B3A]">
                Email Address
              </label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  clearError("contactEmail");
                }}
                placeholder="rahul.sharma@gmail.com"
                className={cn(inputClass, errors.contactEmail && errorInputClass)}
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-600">{errors.contactEmail}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="block text-sm font-bold text-[#1C2B3A]">
                Phone Number
              </label>
              <IndianPhoneField
                id="contactPhone"
                hiddenName=""
                value={contactPhoneDigits}
                onChange={(d) => {
                  setContactPhoneDigits(d);
                  clearError("contactPhone");
                }}
                error={!!errors.contactPhone}
                onBlur={() => clearError("contactPhone")}
                aria-invalid={!!errors.contactPhone}
                aria-label="Contact phone number (10 digits)"
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-600">{errors.contactPhone}</p>
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
                <SelectTrigger id="service" className={inputClass}>
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

          {errors.form && (
            <p className="text-sm text-red-600">{errors.form}</p>
          )}
          {submitStatus === "success" && (
            <p className="text-sm text-green-600">
              Thank you! Our experts will contact you within 24 hours.
            </p>
          )}
          <ConsentCheckboxField
            id="marriage-affidavit-consent"
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
              services.length === 0 ||
              marriageRitesList.length === 0 ||
              !!servicesError ||
              !!ritesError
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
