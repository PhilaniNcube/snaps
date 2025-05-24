import UploadPhotoForm from "@/components/photos/upload-photo-form";
import AddNewSchool from "@/components/schools/add-new-school";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllSchools } from "@/utils/queries/schools";
import React from "react";

const UploadPage = async () => {
  const schoolsData = getAllSchools();
  const classesData = getAllClasses();

  const [schools, classes] = await Promise.all([schoolsData, classesData]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Page</h1>
      <p>This is the upload page where you can manage file uploads.</p>
      <div className="mt-6 ">
        <UploadPhotoForm schools={schools} classes={classes} />
      </div>
    </div>
  );
};

export default UploadPage;
