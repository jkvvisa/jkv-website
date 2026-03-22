import { NextResponse } from "next/server";
import { getInsuranceCoverageOptionsFromDb } from "@/lib/form-options-query";

export async function GET() {
  const fromDb = await getInsuranceCoverageOptionsFromDb();
  if (!fromDb?.length) {
    return NextResponse.json(
      { error: "Insurance coverage options are not available. Please try again later." },
      { status: 503 }
    );
  }
  return NextResponse.json(fromDb);
}
