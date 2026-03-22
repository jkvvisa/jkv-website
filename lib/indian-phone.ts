/** 10-digit Indian mobile without country code (starts with 6–9). */
export const INDIAN_MOBILE_DIGITS_REGEX = /^[6-9]\d{9}$/;

export function fullPhoneFromDigits(digits: string): string {
  return digits.length === 10 ? `+91${digits}` : "";
}
