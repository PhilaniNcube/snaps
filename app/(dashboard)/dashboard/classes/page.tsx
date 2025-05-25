import ClassesList from "@/components/schools/classes-list";
import SchoolSelector from "@/components/schools/school-selector";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllSchools } from "@/utils/queries/schools";
import React from "react";

const ClassesDashboardPage = async () => {
  const classesData = getAllClasses();
  const schoolsData = getAllSchools(); // Assuming this fetches schools, adjust as necessary

  const [classes, schools] = await Promise.all([classesData, schoolsData]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Classes Dashboard</h1>
      <p className="text-muted-foreground">
        Manage your classes and schedules.
      </p>
      <div className="flex justify-between items-center mt-4">
        <SchoolSelector schools={schools} />
      </div>{" "}
      <div>
        {/* Classes */}
        <ClassesList classes={classes} schools={schools} />
      </div>
    </div>
  );
};

export default ClassesDashboardPage;
