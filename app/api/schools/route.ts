import { NextResponse } from "next/server";
import { getAllSchools } from "@/utils/queries/schools";

export async function GET() {
  try {
    const schools = await getAllSchools();
    return NextResponse.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}
