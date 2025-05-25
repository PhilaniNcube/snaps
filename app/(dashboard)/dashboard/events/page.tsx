import { getAllEvents } from "@/utils/queries/events";
import { getAllSchools } from "@/utils/queries/schools";
import React from "react";
import EventsDashboardClient from "@/components/schools/events-dashboard-client";

const EventsDashboardpage = async () => {
  const eventsData = getAllEvents();
  const schoolsData = getAllSchools();

  const [events, schools] = await Promise.all([eventsData, schoolsData]);

  return <EventsDashboardClient initialEvents={events} schools={schools} />;
};

export default EventsDashboardpage;
