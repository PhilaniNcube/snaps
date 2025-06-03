import React from "react";
import PhotoGallery from "@/components/photos/photo-gallery";
import { getPaginatedPhotosWithFiltersSimple } from "@/utils/queries/photos";
import { getAllSchools } from "@/utils/queries/schools";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllEvents } from "@/utils/queries/events";

type SearchParams = {
  page?: string;
  school?: string;
  class?: string;
  event?: string;
  search?: string;
};

type GalleryPageProps = {
  searchParams: Promise<SearchParams>;
};

const GalleryPage = async ({ searchParams }: GalleryPageProps) => {
  // Await search parameters in NextJS 15
  const params = await searchParams;

  // Parse search parameters
  const page = parseInt(params.page || "1");
  const schoolId = params.school ? parseInt(params.school) : undefined;
  const classId = params.class ? parseInt(params.class) : undefined;
  const eventId = params.event ? parseInt(params.event) : undefined;

  // Fetch initial data
  const [photosResult, schools, classes, events] = await Promise.all([
    getPaginatedPhotosWithFiltersSimple({
      page,
      pageSize: 12,
      schoolId,
      classId,
      eventId,
      isPublicOnly: true,
    }),
    getAllSchools(),
    getAllClasses(),
    getAllEvents(),
  ]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-6 px-4">
        <PhotoGallery
          initialPhotos={photosResult.photos}
          schools={schools}
          classes={classes}
          events={events}
          hasMore={photosResult.hasMore}
          showBackToFindSchool={!!schoolId}
        />
      </div>
    </div>
  );
};

export default GalleryPage;
