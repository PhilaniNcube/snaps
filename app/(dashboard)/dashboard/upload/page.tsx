import AddNewSchool from "@/components/schools/add-new-school";
import React from "react";

const UploadPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Page</h1>
      <p>This is the upload page where you can manage file uploads.</p>
      {/* Add your upload form or components here */}
      <AddNewSchool />
      {/* You can also add other components related to uploads */}
    </div>
  );
};

export default UploadPage;
