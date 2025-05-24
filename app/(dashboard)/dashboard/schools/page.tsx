import SchoolManagementPage from "@/components/schools/school-management-page";
import SchoolSelectorDashboard from "@/components/schools/school-selector-dashboard";
import SchoolStats from "@/components/schools/school-stats";
import { getAllClasses } from "@/utils/queries/classes";
import { getAllSchools } from "@/utils/queries/schools";

export default async function SchoolsPage() {
  const schoolsData = getAllSchools();
  const classesData = getAllClasses();

  const [schools, classes] = await Promise.all([schoolsData, classesData]);

  return (
    <div className="container mx-auto py-6">
      <SchoolStats schools={schools} classes={classes} />
      <SchoolSelectorDashboard schools={schools} classes={classes} />
    </div>
  );
}
