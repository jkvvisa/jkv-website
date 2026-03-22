import { NextResponse } from "next/server";
import { getMarriageRitesFromDb } from "@/lib/form-options-query";

export async function GET() {
  const fromDb = await getMarriageRitesFromDb();
  if (!fromDb?.length) {
    return NextResponse.json(
      { error: "Marriage rites options are not available. Please try again later." },
      { status: 503 }
    );
  }
  return NextResponse.json(fromDb);
}
