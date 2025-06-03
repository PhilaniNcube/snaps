import React from "react";
import { getAllSchools } from "@/utils/queries/schools";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllEvents } from "@/utils/queries/events";
import FindSchoolClient from "@/components/find-school/find-school-client";

const FindYourSchool = async () => {
  // Fetch all necessary data
  const [schools, classes, events] = await Promise.all([
    getAllSchools(),
    getAllClasses(),
    getAllEvents(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your School
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover your school's photo galleries and browse through memorable
            moments
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* School Listing Component */}
        <FindSchoolClient schools={schools} classes={classes} events={events} />
      </div>
    </div>
  );
};

export default FindYourSchool;
