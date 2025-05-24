import { NextResponse } from "next/server";
import { getAllClasses } from "@/utils/queries/classes";

export async function GET() {
  try {
    const classes = await getAllClasses();
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
