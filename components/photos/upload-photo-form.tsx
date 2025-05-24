"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import React from "react";

const UploadPhotoForm = () => {
  const props = useSupabaseUpload({
    bucketName: "school-photos",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  // successes is an array of successfully uploaded file url
  const successes = props.successes;

  return (
    <div>
      <div className="w-[500px]">
        <Dropzone {...props}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    </div>
  );
};

export default UploadPhotoForm;
