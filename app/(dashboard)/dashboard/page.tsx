import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  DollarSign,
  ImageIcon,
  Upload,
  Users,
  School,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SchoolManagementPage from "@/components/schools/school-management-page";
import { getAllSchools } from "@/utils/queries/schools";
import { getAllClasses } from "@/utils/queries/classes";
import SchoolStats from "@/components/schools/school-stats";
import SchoolSelectorDashboard from "@/components/schools/school-selector-dashboard";

const DashboardPage = async () => {
  const schoolsData = getAllSchools();
  const classesData = getAllClasses();

  const [schools, classes] = await Promise.all([schoolsData, classesData]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Photographer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your photos, orders, and account.
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Upload className="mr-2" />
            Upload New Photos
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+24 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Galleries
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,385.00</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +18 from last month
            </p>{" "}
          </CardContent>
        </Card>
      </div>

      {/* School Management Section */}
      <div className="mt-12">
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
      </div>
    </div>
  );
};

export default DashboardPage;
