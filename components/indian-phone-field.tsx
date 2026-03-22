"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fullPhoneFromDigits } from "@/lib/indian-phone";

export interface IndianPhoneFieldProps {
  /** Digits only (0–10 chars), excluding +91 */
  value: string;
  onChange: (digits: string) => void;
  /** Hidden input for FormData (`+91` + digits). Set to `""` when the parent submits from state only (no native `phone` field). */
  hiddenName?: string;
  id?: string;
  error?: boolean;
  onBlur?: () => void;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
}

export function IndianPhoneField({
  value,
  onChange,
  hiddenName,
  id = "phone",
  error,
  onBlur,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel = "Mobile number (10 digits)",
}: IndianPhoneFieldProps) {
  const resolvedHiddenName = hiddenName === undefined ? "phone" : hiddenName;
  const full = fullPhoneFromDigits(value);

  return (
    <div className="flex gap-2">
      <Input
        readOnly
        disabled
        tabIndex={-1}
        value="+91"
        className={cn(
          "h-10 w-10 shrink-0 cursor-not-allowed bg-gray-100/70 px-0 text-center text-sm font-medium tabular-nums text-[#1C2B3A]",
          "border-gray-200/80 opacity-100"
        )}
        aria-hidden
      />
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        placeholder="9876543210"
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
          onChange(digits);
        }}
        onBlur={onBlur}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "min-w-0 flex-1 bg-gray-100/70 border-gray-200/80 tabular-nums tracking-wide",
          error && "border-red-500 focus-visible:ring-red-500"
        )}
      />
      {resolvedHiddenName ? (
        <input type="hidden" name={resolvedHiddenName} value={full} readOnly aria-hidden />
      ) : null}
    </div>
  );
}
