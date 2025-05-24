"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import React from "react";

type ComponentProps = {
  schools: Database["public"]["Tables"]["schools"]["Row"][];
  classes: Database["public"]["Tables"]["classes"]["Row"][];
};

const UploadPhotoForm = ({ schools, classes }: ComponentProps) => {
  // add a hook to select a school
  const [selectedSchool, setSelectedSchool] = React.useState<
    Database["public"]["Tables"]["schools"]["Row"] | null
  >(null);

  // filter classes by selected school, and sue the useMemo hook to memoize the filtered classes
  const filteredClasses = React.useMemo(() => {
    if (!selectedSchool) return [];
    return classes.filter((c) => c.school_id === selectedSchool.school_id);
  }, [selectedSchool, classes]);

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
