"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import SchoolSelectorDashboard from "@/components/schools/school-selector-dashboard";
import SchoolStats from "@/components/schools/school-stats";

type ComponentProps = {
  schools: Database["public"]["Tables"]["schools"]["Row"][];
  classes: Database["public"]["Tables"]["classes"]["Row"][];
};

const SchoolManagementPage = ({ schools, classes }: ComponentProps) => {
  return (
    <div className="container mx-auto py-6">
      {" "}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">School Management</h1>
        <p className="text-muted-foreground mt-2">
          Select a school to manage classes and students
        </p>
      </div>
      {/* School Statistics */}
      <SchoolStats schools={schools} classes={classes} />
      <SchoolSelectorDashboard schools={schools} classes={classes} />
    </div>
  );
};

export default SchoolManagementPage;
