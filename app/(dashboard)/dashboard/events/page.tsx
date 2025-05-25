import { getAllEvents } from "@/utils/queries/events";
import { getAllSchools } from "@/utils/queries/schools";
import React from "react";
import EventsList from "@/components/schools/events-list";
import EventsSchoolSelector from "@/components/schools/events-school-selector";

const EventsDashboardpage = async () => {
  const eventsData = getAllEvents();
  const schoolsData = getAllSchools();

  const [events, schools] = await Promise.all([eventsData, schoolsData]);

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* School Filter */}
        <EventsSchoolSelector schools={schools} />

        {/* Events List */}
        <EventsList events={events} schools={schools} />
      </div>
    </div>
  );
};

export default EventsDashboardpage;
