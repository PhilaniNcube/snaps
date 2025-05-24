import React from "react";
import AddClass from "./add-class";

interface SchoolClassesPageProps {
  schoolId: number;
  schoolName: string;
}

// Example usage component showing how to integrate the AddClass form
const SchoolClassesPage: React.FC<SchoolClassesPageProps> = ({
  schoolId,
  schoolName,
}) => {
  const handleClassCreated = () => {
    // This function can be used to refresh the classes list
    // or perform other actions after a class is successfully created
    console.log("Class created successfully!");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Classes for {schoolName}
        </h1>
        <p className="text-gray-600 mt-2">Manage classes for this school</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add new class form */}
        <div>
          <AddClass schoolId={schoolId} onSuccess={handleClassCreated} />
        </div>

        {/* Classes list would go here */}
        <div>
          {/* You can add a ClassesList component here that shows existing classes */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Existing Classes</h3>
            <p className="text-gray-600">
              Classes list component would be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolClassesPage;
