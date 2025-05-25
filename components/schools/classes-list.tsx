"use client";

import React, { useMemo } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Calendar, User, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ClassesListProps = {
  classes: Database["public"]["Tables"]["classes"]["Row"][];
  schools: Database["public"]["Tables"]["schools"]["Row"][];
};

const ClassesList = ({ classes, schools }: ClassesListProps) => {
  // Get selected school ID from URL parameters
  const [selectedSchoolId] = useQueryState("school", parseAsInteger);

  // Filter classes based on selected school
  const filteredClasses = useMemo(() => {
    if (!selectedSchoolId) return [];
    return classes.filter((classItem) => classItem.school_id === selectedSchoolId);
  }, [classes, selectedSchoolId]);

  // Get selected school information
  const selectedSchool = useMemo(() => {
    if (!selectedSchoolId) return null;
    return schools.find((school) => school.school_id === selectedSchoolId);
  }, [schools, selectedSchoolId]);

  // Calculate stats for the filtered classes
  const classStats = useMemo(() => {
    if (filteredClasses.length === 0) return null;

    const uniqueTeachers = new Set(
      filteredClasses
        .filter((c) => c.teacher_name)
        .map((c) => c.teacher_name)
    ).size;

    const uniqueYears = new Set(
      filteredClasses
        .filter((c) => c.academic_year)
        .map((c) => c.academic_year)
    ).size;

    const classesWithEvents = filteredClasses.filter((c) => c.event_id).length;

    return {
      totalClasses: filteredClasses.length,
      uniqueTeachers,
      uniqueYears,
      classesWithEvents,
    };
  }, [filteredClasses]);

  if (!selectedSchoolId) {
    return (
      <Card className="mt-6">
        <CardContent className="p-12">
          <div className="text-center">
            <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a School</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Choose a school from the dropdown above to view its classes.
            </p>
            <Link href="/dashboard/schools">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to School Management
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Header with school info */}
      {selectedSchool && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Classes for {selectedSchool.school_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{filteredClasses.length} classes found</span>
              {selectedSchool.contact_person && (
                <span>Contact: {selectedSchool.contact_person}</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {classStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Classes</p>
                  <p className="text-2xl font-bold">{classStats.totalClasses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Teachers</p>
                  <p className="text-2xl font-bold">{classStats.uniqueTeachers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Academic Years</p>
                  <p className="text-2xl font-bold">{classStats.uniqueYears}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">With Events</p>
                  <p className="text-2xl font-bold">{classStats.classesWithEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classItem) => (
            <Card key={classItem.class_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{classItem.class_name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    ID: {classItem.class_id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Teacher Information */}
                {classItem.teacher_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Teacher:</span>
                    <span>{classItem.teacher_name}</span>
                  </div>
                )}

                {/* Academic Year */}
                {classItem.academic_year && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Academic Year:</span>
                    <span>{classItem.academic_year}</span>
                  </div>
                )}

                {/* Event Information */}
                {classItem.event_id && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      Event ID: {classItem.event_id}
                    </Badge>
                  </div>
                )}

                {/* Footer with additional info */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Class ID: {classItem.class_id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Classes Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                {selectedSchool
                  ? `No classes have been created for ${selectedSchool.school_name} yet.`
                  : "No classes found for the selected school."}
              </p>
              <Link href="/dashboard/schools">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Classes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassesList;
