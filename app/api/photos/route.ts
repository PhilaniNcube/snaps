import { NextRequest, NextResponse } from "next/server";
import { getPaginatedPhotosWithFiltersSimple } from "@/utils/queries/photos";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const schoolId = searchParams.get("schoolId")
      ? parseInt(searchParams.get("schoolId")!)
      : undefined;
    const classId = searchParams.get("classId")
      ? parseInt(searchParams.get("classId")!)
      : undefined;
    const eventId = searchParams.get("eventId")
      ? parseInt(searchParams.get("eventId")!)
      : undefined;
    const search = searchParams.get("search") || undefined;

    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Fetch photos with filters
    const result = await getPaginatedPhotosWithFiltersSimple({
      page,
      pageSize,
      schoolId,
      classId,
      eventId,
      isPublicOnly: true, // Only show public photos in gallery
    });

    // Filter by search term if provided (simple text search)
    let filteredPhotos = result.photos;
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filteredPhotos = result.photos.filter((photo) => {
        return (
          photo.photo_reference_code.toLowerCase().includes(searchTerm) ||
          photo.classes?.class_name.toLowerCase().includes(searchTerm) ||
          photo.classes?.schools?.school_name
            .toLowerCase()
            .includes(searchTerm) ||
          photo.photo_shoot_events?.event_name
            .toLowerCase()
            .includes(searchTerm)
        );
      });
    }

    return NextResponse.json({
      photos: filteredPhotos,
      hasMore: result.hasMore && filteredPhotos.length === pageSize,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Error in photos API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
