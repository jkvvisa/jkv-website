import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VISA_PURPOSES = new Set(["tourism", "business", "visiting-family"]);

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      purpose_of_travel,
      country_id,
      consent_accepted,
      service_id: rawServiceId,
      service_slug: rawServiceSlug,
      metadata,
    } = body;

    const validCountryId =
      country_id && typeof country_id === "string" && UUID_REGEX.test(country_id)
        ? country_id
        : null;

    const consentOk =
      consent_accepted === true ||
      consent_accepted === "true" ||
      body.consent === true;

    if (!full_name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Full name, email, and phone are required" },
        { status: 400 }
      );
    }

    if (!consentOk) {
      return NextResponse.json(
        { error: "Consent is required" },
        { status: 400 }
      );
    }

    let resolvedServiceId: string | null =
      rawServiceId && typeof rawServiceId === "string" && UUID_REGEX.test(rawServiceId)
        ? rawServiceId
        : null;

    const purposeStr =
      typeof purpose_of_travel === "string" && purpose_of_travel.trim()
        ? purpose_of_travel.trim()
        : null;

    const slugHint =
      typeof rawServiceSlug === "string" && rawServiceSlug.trim()
        ? rawServiceSlug.trim()
        : null;

    if (!resolvedServiceId && slugHint) {
      const { data: bySlugHint } = await supabaseAdmin
        .from("services")
        .select("id")
        .eq("slug", slugHint)
        .eq("is_active", true)
        .maybeSingle();
      if (bySlugHint?.id) {
        resolvedServiceId = bySlugHint.id;
      }
    }

    if (!resolvedServiceId && purposeStr && !VISA_PURPOSES.has(purposeStr)) {
      const { data: bySlug } = await supabaseAdmin
        .from("services")
        .select("id")
        .eq("slug", purposeStr)
        .eq("is_active", true)
        .maybeSingle();
      if (bySlug?.id) {
        resolvedServiceId = bySlug.id;
      }
    }

    if (resolvedServiceId) {
      const { data: svc, error: svcErr } = await supabaseAdmin
        .from("services")
        .select("id, name, slug")
        .eq("id", resolvedServiceId)
        .eq("is_active", true)
        .maybeSingle();

      if (svcErr || !svc) {
        return NextResponse.json(
          { error: "Invalid or inactive service" },
          { status: 400 }
        );
      }

      const meta =
        metadata !== undefined && metadata !== null && typeof metadata === "object"
          ? (metadata as Record<string, unknown>)
          : null;

      const purposeDisplay =
        purposeStr && purposeStr.length > 0 ? purposeStr : svc.name;

      const { data, error } = await supabaseAdmin
        .from("leads")
        .insert({
          full_name: full_name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          purpose_of_travel: purposeDisplay,
          country_id: validCountryId,
          consent_accepted: true,
          status: "new",
          lead_type: "service",
          service_id: svc.id,
          metadata: meta,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase leads insert error:", error);
        return NextResponse.json(
          { error: "Failed to submit. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, id: data?.id });
    }

    let leadType: "visa" | "general" = "general";
    if (validCountryId && purposeStr && VISA_PURPOSES.has(purposeStr)) {
      leadType = "visa";
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        full_name: full_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        purpose_of_travel: purposeStr,
        country_id: validCountryId,
        consent_accepted: true,
        status: "new",
        lead_type: leadType,
        service_id: null,
        metadata:
          metadata !== undefined && metadata !== null && typeof metadata === "object"
            ? metadata
            : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase leads insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
