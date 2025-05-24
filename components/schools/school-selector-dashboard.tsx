"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  School,
  Users,
  GraduationCap,
  Plus,
  RefreshCw,
  CameraIcon,
} from "lucide-react";

import AddClass from "@/components/schools/add-class";
import AddStudent from "@/components/schools/add-student";
import AddEvent from "@/components/schools/add-event";
import AddSchoolDialog from "@/components/schools/add-school-dialog";
import { Separator } from "../ui/separator";

interface SchoolSelectorDashboardProps {
  schools: Database["public"]["Tables"]["schools"]["Row"][];
  classes: Database["public"]["Tables"]["classes"]["Row"][];
  onRefresh?: () => void;
}

const SchoolSelectorDashboard: React.FC<SchoolSelectorDashboardProps> = ({
  schools,
  classes,
  onRefresh,
}) => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<
    Database["public"]["Tables"]["schools"]["Row"] | null
  >(null);
  const [schoolClasses, setSchoolClasses] = useState<
    Database["public"]["Tables"]["classes"]["Row"][]
  >([]);

  // Update selected school and filter classes when school selection changes
  useEffect(() => {
    if (selectedSchoolId) {
      const school = schools.find((s) => s.school_id === selectedSchoolId);
      setSelectedSchool(school || null);

      // Filter classes for the selected school
      const filteredClasses = classes.filter(
        (c) => c.school_id === selectedSchoolId
      );
      setSchoolClasses(filteredClasses);
    } else {
      setSelectedSchool(null);
      setSchoolClasses([]);
    }
  }, [selectedSchoolId, schools, classes]);

  const handleSchoolSelect = (schoolId: string) => {
    setSelectedSchoolId(parseInt(schoolId));
  };
  const handleClassCreated = () => {
    // Refresh data when a class is created
    onRefresh?.();
    console.log("Class created successfully!");
  };

  const handleStudentAdded = () => {
    // Refresh data when a student is added
    onRefresh?.();
    console.log("Student added successfully!");
  };

  const handleEventCreated = () => {
    // Refresh data when an event is created
    onRefresh?.();
    console.log("Event created successfully!");
  };

  const handleSchoolAdded = () => {
    // Refresh data when a school is added
    onRefresh?.();
    console.log("School added successfully!");
  };

  return (
    <div className="space-y-6">
      {" "}
      {/* School Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Select School
            </CardTitle>
            <div className="flex items-center gap-2">
              <AddSchoolDialog onSchoolAdded={handleSchoolAdded} />
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleSchoolSelect}>
            <SelectTrigger className="w-full p-3">
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
        </CardContent>
      </Card>
      {/* School Management Forms - Only show when a school is selected */}
      {selectedSchool && (
        <div className="space-y-6">
          {/* School Info Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Managing: {selectedSchool.school_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Contact Person:</strong>{" "}
                  {selectedSchool.contact_person || "N/A"}
                </div>
                <div>
                  <strong>Email:</strong>{" "}
                  {selectedSchool.contact_email || "N/A"}
                </div>
                <div>
                  <strong>Phone:</strong>{" "}
                  {selectedSchool.contact_phone || "N/A"}
                </div>
              </div>
              {selectedSchool.address && (
                <div className="mt-2 text-sm">
                  <strong>Address:</strong> {selectedSchool.address}
                </div>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{schoolClasses.length} classes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Management Tabs */}
          <Tabs defaultValue="add-class" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="add-class"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Class
              </TabsTrigger>
              <TabsTrigger
                value="add-student"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Add Student
              </TabsTrigger>
              <TabsTrigger
                value="photo-shoot"
                className="flex items-center gap-2"
              >
                <CameraIcon className="h-4 w-4" />
                Add Photo Shoot Event
              </TabsTrigger>
            </TabsList>
            {/* Add Class Tab */}
            <TabsContent value="add-class" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {" "}
                {/* Add Class Form */}
                <div>
                  {selectedSchoolId && (
                    <AddClass
                      schoolId={selectedSchoolId}
                      onSuccess={handleClassCreated}
                    />
                  )}
                </div>
                {/* Existing Classes List */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Existing Classes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {schoolClasses.length > 0 ? (
                        <div className="space-y-3">
                          {schoolClasses.map((classItem) => (
                            <div
                              key={classItem.class_id}
                              className="p-3 bg-gray-50 rounded-lg border"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    {classItem.class_name}
                                  </h4>
                                  {classItem.teacher_name && (
                                    <p className="text-xs text-muted-foreground">
                                      Teacher: {classItem.teacher_name}
                                    </p>
                                  )}
                                  {classItem.academic_year && (
                                    <p className="text-xs text-muted-foreground">
                                      Year: {classItem.academic_year}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  ID: {classItem.class_id}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No classes found for this school. Add the first class!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            {/* Add Student Tab */}
            <TabsContent value="add-student" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Student Form */}
                <div>
                  {schoolClasses.length > 0 ? (
                    <AddStudent
                      classes={schoolClasses}
                      defaultClassId={schoolClasses[0]?.class_id}
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-8">
                          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Classes Available
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            You need to create at least one class before adding
                            students.
                          </p>
                          <Button
                            onClick={() => {
                              // Switch to add-class tab
                              const addClassTab = document.querySelector(
                                '[value="add-class"]'
                              ) as HTMLElement;
                              addClassTab?.click();
                            }}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Class
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Classes Summary for Student Assignment */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Available Classes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {schoolClasses.length > 0 ? (
                        <div className="space-y-3">
                          {schoolClasses.map((classItem) => (
                            <div
                              key={classItem.class_id}
                              className="p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    {classItem.class_name}{" "}
                                    <small className="font-medium">
                                      ({classItem.academic_year})
                                    </small>
                                  </h4>
                                  {classItem.teacher_name && (
                                    <p className="text-xs text-muted-foreground">
                                      Teacher: {classItem.teacher_name}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Available
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No classes available for student assignment.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>{" "}
            {/* Photo Shoot Tab */}
            <TabsContent value="photo-shoot" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Event Form */}
                <div>
                  {selectedSchoolId && (
                    <AddEvent
                      schoolId={selectedSchoolId}
                      onSuccess={handleEventCreated}
                    />
                  )}
                </div>

                {/* Event Info/Tips */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Photo Shoot Event Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-1">📅 Shoot Date</h4>
                          <p className="text-muted-foreground">
                            The actual date when photos will be taken at the
                            school.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            ⏰ Order Deadline
                          </h4>
                          <p className="text-muted-foreground">
                            Last date for parents to place orders for their
                            child's photos.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            🖼️ Gallery Live Until
                          </h4>
                          <p className="text-muted-foreground">
                            How long the photo gallery will remain accessible to
                            parents.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">📝 Notes</h4>
                          <p className="text-muted-foreground">
                            Additional information like dress code, schedule, or
                            special instructions.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {/* No School Selected State */}
      {!selectedSchool && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <School className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select a School</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose a school from the dropdown above to start managing
                classes and students. You can add new classes and assign
                students to those classes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchoolSelectorDashboard;
