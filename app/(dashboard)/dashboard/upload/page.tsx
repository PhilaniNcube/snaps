import UploadPhotoForm from "@/components/photos/upload-photo-form";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllSchools } from "@/utils/queries/schools";
import { getAllStudents } from "@/utils/queries/students";
import { getAllEvents } from "@/utils/queries/events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
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
          Choose the type of photos you want to upload
        </p>
      </div>

      {/* Upload Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Individual Student Photos
            </CardTitle>
            <CardDescription>
              Upload photos for specific students with privacy controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use this option for individual student portraits and photos that
              need parent approval for public display.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#individual-upload">
                Upload Individual Photos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Class/Event Photos
            </CardTitle>
            <CardDescription>
              Upload group photos and event photos (automatically public)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use this option for class group photos, event documentation, and
              other photos meant for public galleries.
            </p>
            <Button className="w-full" asChild>
              <Link href="/dashboard/upload-class-photos">
                Upload Class/Event Photos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div id="individual-upload">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Individual Student Photos</h2>
          <p className="text-muted-foreground mt-1">
            Upload photos for specific students with privacy controls
          </p>
        </div>
        <UploadPhotoForm
          schools={schools}
          classes={classes}
          students={students}
          events={events}
        />
      </div>
    </div>
  );
};

export default UploadPage;
