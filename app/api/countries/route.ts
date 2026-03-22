import { NextResponse } from "next/server";
import { getCountries } from "@/lib/countries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  const countries = await getCountries();

  if (q && q.length >= 1) {
    const filtered = countries.filter((c) =>
      c.name.toLowerCase().startsWith(q)
    );
    return NextResponse.json(filtered);
  }

  return NextResponse.json(countries);
}
