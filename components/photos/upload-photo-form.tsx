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
    maxFiles: 2,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

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
