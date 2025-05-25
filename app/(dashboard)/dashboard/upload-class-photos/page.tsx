import UploadClassEventPhotoForm from "@/components/photos/upload-class-event-photo-form";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllSchools } from "@/utils/queries/schools";
import { getAllEvents } from "@/utils/queries/events";
import React from "react";

const UploadClassEventPhotoPage = async () => {
  const schoolsData = getAllSchools();
  const classesData = getAllClasses();
  const eventsData = getAllEvents();

  const [schools, classes, events] = await Promise.all([
    schoolsData,
    classesData,
    eventsData,
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Class/Event Photos</h1>
        <p className="text-muted-foreground mt-2">
          Upload photos for classes and events that will be publicly available
          in galleries
        </p>
      </div>

      <UploadClassEventPhotoForm
        schools={schools}
        classes={classes}
        events={events}
      />
    </div>
  );
};

export default UploadClassEventPhotoPage;
