"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { parseAsInteger, useQueryState } from "nuqs";

type ComponentProps = {
  schools: Database["public"]["Tables"]["schools"]["Row"][];
};

const SchoolSelector = ({ schools }: ComponentProps) => {
  const [selectedSchoolId, setSelectedSchoolId] = useQueryState(
    "school",
    parseAsInteger
  );

  const [selectedSchool, setSelectedSchool] = useState<
    Database["public"]["Tables"]["schools"]["Row"] | null
  >(null);

  const handleSchoolSelect = (schoolId: string) => {
    const schoolIdNum = parseInt(schoolId);
    setSelectedSchoolId(schoolIdNum);
  };

  return (
    <div>
      <Select
        onValueChange={handleSchoolSelect}
        value={selectedSchoolId?.toString() || ""}
      >
        <SelectTrigger className="w-full p-3 min-w-lg">
          <SelectValue placeholder="Choose a school to manage" />
        </SelectTrigger>
        <SelectContent>
          {schools.map((school) => (
            <SelectItem
              key={school.school_id}
              value={school.school_id.toString()}
            >
              <div className="flex p-3">
                <span className="font-medium">{school.school_name}</span>
                <Separator orientation="vertical" className="mx-2" />
                {school.contact_person && (
                  <span className="text-sm text-muted-foreground">
                    Contact: {school.contact_person}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SchoolSelector;
