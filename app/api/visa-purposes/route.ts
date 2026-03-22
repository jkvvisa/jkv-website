import { NextResponse } from "next/server";
import { getVisaPurposesFromDb } from "@/lib/form-options-query";

export async function GET() {
  const fromDb = await getVisaPurposesFromDb();
  if (!fromDb?.length) {
    return NextResponse.json(
      { error: "Visa purposes are not available. Please try again later." },
      { status: 503 }
    );
  }
  return NextResponse.json(fromDb);
}
