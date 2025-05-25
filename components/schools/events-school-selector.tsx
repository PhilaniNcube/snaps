"use client";

import React from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { School, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/utils/supabase/schema";

type SchoolType = Database["public"]["Tables"]["schools"]["Row"];

interface EventsSchoolSelectorProps {
  schools: SchoolType[];
}

const EventsSchoolSelector: React.FC<EventsSchoolSelectorProps> = ({
  schools,
}) => {
  const [selectedSchoolId, setSelectedSchoolId] = useQueryState(
    "school",
    parseAsInteger
  );

  const selectedSchool = selectedSchoolId
    ? schools.find((school) => school.school_id === selectedSchoolId)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5" />
          Filter by School
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select
            value={selectedSchoolId?.toString() || ""}
            onValueChange={(value) =>
              setSelectedSchoolId(value ? parseInt(value) : null)
            }
          >
            <SelectTrigger>
              <SelectValue
                className="w-[200px]"
                placeholder="Select a school to filter events..."
              />
            </SelectTrigger>
            <SelectContent className="overflow-y-auto">
              {schools.map((school) => (
                <SelectItem
                  className=""
                  key={school.school_id}
                  value={school.school_id.toString()}
                >
                  <div className="flex flex-col py-2">
                    <span className="font-medium">{school.school_name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSchool && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">
                  {selectedSchool.school_name}
                </p>
                <p className="text-xs text-blue-700">
                  Viewing events for this school only
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSchoolId(null)}
                className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsSchoolSelector;
