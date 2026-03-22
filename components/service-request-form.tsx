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
import type { ServiceOption } from "@/lib/service-types";

interface PlanOption {
  value: string;
  label: string;
}

interface ServiceRequestFormProps {
  defaultService: string;
  serviceTitle: string;
  onSuccess?: () => void;
  planOptedOptions?: PlanOption[];
  defaultPlanOpted?: string | null;
  /** When true, form card fills container width (e.g. in side-by-side layout) */
  fullWidth?: boolean;
  /** When true, form is the single card (no outer wrapper); Card uses its own border/shadow */
  standaloneCard?: boolean;
}

export function ServiceRequestForm({
  defaultService,
  serviceTitle,
  onSuccess,
  planOptedOptions,
  defaultPlanOpted,
  fullWidth,
  standaloneCard,
}: ServiceRequestFormProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [serviceValue, setServiceValue] = useState(defaultService);

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
  }, []);
  const [planOptedValue, setPlanOptedValue] = useState(defaultPlanOpted ?? "");
  const [numApplicants, setNumApplicants] = useState("1");

  useEffect(() => {
    if (defaultPlanOpted) {
      setPlanOptedValue(defaultPlanOpted);
    }
  }, [defaultPlanOpted]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [consent, setConsent] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState("");

  function validate(
    name: string,
    email: string,
    phoneDigitsValue: string,
    service: string,
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

    if (!service) {
      newErrors.service = "Please select a service";
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

    if (!validate(name, email, phoneDigits, serviceValue, consent)) {
      return;
    }

    const phone = fullPhoneFromDigits(phoneDigits);

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const svcRow = services.find((s) => s.slug === serviceValue);
      const serviceLabel = svcRow?.name ?? serviceValue;
      const planLabel = planOptedOptions?.find((o) => o.value === planOptedValue)?.label;
      let purposeText = planLabel
        ? `${serviceLabel} - Plan opted: ${planLabel}`
        : serviceLabel;
      if (planOptedOptions && planOptedOptions.length > 0) {
        purposeText += ` - No. of applicants: ${numApplicants}`;
      }
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name.trim(),
          email: email.trim(),
          phone,
          purpose_of_travel: purposeText,
          country_id: null,
          consent_accepted: consent,
          service_id: svcRow?.id,
          service_slug: serviceValue,
          metadata:
            planOptedOptions && planOptedOptions.length > 0
              ? {
                  planOpted: planOptedValue,
                  numApplicants,
                }
              : undefined,
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
      setServiceValue(defaultService);
      setPlanOptedValue(defaultPlanOpted ?? "");
      setNumApplicants("1");
      setConsent(false);
      onSuccess?.();
    } catch {
      setSubmitStatus("error");
      setErrors((prev) => ({
        ...prev,
        form: "Failed to submit. Please try again.",
      }));
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

  return (
    <Card
      className={cn(
        "w-full bg-white",
        !fullWidth && "max-w-xl",
        standaloneCard ? "border border-gray-200 shadow-sm" : "border-0"
      )}
    >
      <CardHeader>
        <h3 className="font-semibold">Request {serviceTitle}</h3>
        <p className="text-sm text-muted-foreground">
          Fill out the form and our experts will contact you within 24 hours.
        </p>
      </CardHeader>
      <CardContent className={standaloneCard ? "pt-2" : undefined}>
        <form className={cn("space-y-4", standaloneCard && "space-y-6")} onSubmit={handleSubmit}>
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
                <p id="name-error" className="text-sm text-red-600">
                  {errors.name}
                </p>
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
                <p id="email-error" className="text-sm text-red-600">
                  {errors.email}
                </p>
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
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-sm text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="service" className="block text-sm font-bold text-[#1C2B3A]">
                Service Required
              </label>
              <Select
                value={serviceValue}
                onValueChange={(v) => {
                  if (v !== defaultService) {
                    router.push(`/services/${v}`);
                    return;
                  }
                  setServiceValue(v);
                  if (errors.service) clearError("service");
                }}
              >
                <SelectTrigger
                  id="service"
                  aria-label="Service required"
                  aria-invalid={!!errors.service}
                  className={cn(
                    "bg-gray-100/70 border-gray-200/80",
                    errors.service && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {servicesError && (
                <p className="text-sm text-amber-700">{servicesError}</p>
              )}
              {errors.service && (
                <p id="service-error" className="text-sm text-red-600">
                  {errors.service}
                </p>
              )}
            </div>
            {planOptedOptions && planOptedOptions.length > 0 && (
              <>
                <div className="space-y-2">
                  <label htmlFor="planOpted" className="block text-sm font-bold text-[#1C2B3A]">
                    Plan opted
                  </label>
                  <Select
                    value={planOptedValue}
                    onValueChange={(v) => {
                      setPlanOptedValue(v);
                      if (errors.planOpted) clearError("planOpted");
                    }}
                  >
                    <SelectTrigger
                      id="planOpted"
                      aria-label="Plan opted"
                      aria-invalid={!!errors.planOpted}
                      className={cn(
                        "bg-gray-100/70 border-gray-200/80",
                        errors.planOpted && "border-red-500 focus-visible:ring-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {planOptedOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.planOpted && (
                    <p id="planOpted-error" className="text-sm text-red-600">
                      {errors.planOpted}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="numApplicants" className="block text-sm font-bold text-[#1C2B3A]">
                    No. of applicants
                  </label>
                  <Select
                    value={numApplicants}
                    onValueChange={setNumApplicants}
                  >
                    <SelectTrigger
                      id="numApplicants"
                      aria-label="Number of applicants"
                      className="bg-gray-100/70 border-gray-200/80"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                      <SelectItem value="10+">10+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
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
            id="service-request-consent"
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
            disabled={isSubmitting || services.length === 0 || !!servicesError}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
