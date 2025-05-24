"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, GraduationCap, Users, Calendar } from "lucide-react";

interface SchoolStatsProps {
  schools: Database["public"]["Tables"]["schools"]["Row"][];
  classes: Database["public"]["Tables"]["classes"]["Row"][];
}

const SchoolStats: React.FC<SchoolStatsProps> = ({ schools, classes }) => {
  const totalSchools = schools.length;
  const totalClasses = classes.length;

  // Calculate classes per school
  const schoolsWithClasses = schools.reduce((acc, school) => {
    const schoolClasses = classes.filter(
      (c) => c.school_id === school.school_id
    );
    return schoolClasses.length > 0 ? acc + 1 : acc;
  }, 0);

  // Calculate current academic year
  const currentYear = new Date().getFullYear();
  const currentYearClasses = classes.filter(
    (c) => c.academic_year === currentYear
  );

  const stats = [
    {
      title: "Total Schools",
      value: totalSchools,
      icon: School,
      description: `${schoolsWithClasses} with classes`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Classes",
      value: totalClasses,
      icon: GraduationCap,
      description: `Across all schools`,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Current Year Classes",
      value: currentYearClasses.length,
      icon: Calendar,
      description: `Academic year ${currentYear}`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Average Classes/School",
      value:
        totalSchools > 0
          ? Math.round((totalClasses / totalSchools) * 10) / 10
          : 0,
      icon: Users,
      description: "Classes per school",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SchoolStats;
