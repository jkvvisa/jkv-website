import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawCountry = searchParams.get("country_id")?.trim();
  const validCountryId =
    rawCountry && UUID_REGEX.test(rawCountry) ? rawCountry : null;

  let query = supabaseAdmin
    .from("services")
    .select("id, slug, name, description, country_id, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (validCountryId) {
    query = query.or(`country_id.is.null,country_id.eq.${validCountryId}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase services fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}
