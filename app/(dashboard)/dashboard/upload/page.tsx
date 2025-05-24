import UploadPhotoForm from "@/components/photos/upload-photo-form";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllSchools } from "@/utils/queries/schools";
import { getAllStudents } from "@/utils/queries/students";
import { getAllEvents } from "@/utils/queries/events";
import React from "react";

const UploadPage = async () => {
  const schoolsData = getAllSchools();
  const classesData = getAllClasses();
  const studentsData = getAllStudents();
  const eventsData = getAllEvents();

  const [schools, classes, students, events] = await Promise.all([
    schoolsData,
    classesData,
    studentsData,
    eventsData,
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Photos</h1>
        <p className="text-muted-foreground mt-2">
          Upload new photos to the school galleries
        </p>
      </div>

      <UploadPhotoForm
        schools={schools}
        classes={classes}
        students={students}
        events={events}
      />
    </div>
  );
};

export default UploadPage;
