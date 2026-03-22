"use client";

import { cn } from "@/lib/utils";

const DEFAULT_LABEL =
  "I consent to the processing of my details for this enquiry and to being contacted by JKV VisaXpress regarding my request.";

type ConsentCheckboxFieldProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
  label?: string;
};

export function ConsentCheckboxField({
  id,
  checked,
  onChange,
  error,
  className,
  label = DEFAULT_LABEL,
}: ConsentCheckboxFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={cn(
            "mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0",
            error && "border-red-500"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="text-sm leading-snug text-[#4B5563]">
          <span className="text-red-600" aria-hidden>
            *{" "}
          </span>
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
