import { supabaseAdmin } from "@/lib/supabase";
import type { LabelValueOption } from "@/lib/form-options";

type OptionsTableName =
  | "visa_purposes"
  | "insurance_coverage_options"
  | "marriage_rites";

async function getLabelValueOptionsFromTable(
  table: OptionsTableName,
  logLabel: string
): Promise<LabelValueOption[] | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(table)
    .select("value, label")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`${logLabel} query error:`, error);
    return null;
  }

  if (!data?.length) return null;

  return data.map((row) => ({
    value: String(row.value),
    label: String(row.label),
  }));
}

export async function getVisaPurposesFromDb(): Promise<LabelValueOption[] | null> {
  return getLabelValueOptionsFromTable("visa_purposes", "visa_purposes");
}

export async function getInsuranceCoverageOptionsFromDb(): Promise<
  LabelValueOption[] | null
> {
  return getLabelValueOptionsFromTable(
    "insurance_coverage_options",
    "insurance_coverage_options"
  );
}

export async function getMarriageRitesFromDb(): Promise<LabelValueOption[] | null> {
  return getLabelValueOptionsFromTable("marriage_rites", "marriage_rites");
}
