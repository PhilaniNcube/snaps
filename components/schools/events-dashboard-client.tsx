"use client";

import React, { useState, useCallback } from "react";
import EventsList from "@/components/schools/events-list";
import EventsSchoolSelector from "@/components/schools/events-school-selector";
import { Database } from "@/utils/supabase/schema";
import { useRouter } from "next/navigation";

type Event = Database["public"]["Tables"]["photo_shoot_events"]["Row"] & {
  schools?: {
    school_id: number;
    school_name: string;
  } | null;
};

type School = Database["public"]["Tables"]["schools"]["Row"];

interface EventsDashboardClientProps {
  initialEvents: Event[];
  schools: School[];
}

const EventsDashboardClient: React.FC<EventsDashboardClientProps> = ({
  initialEvents,
  schools,
}) => {
  const router = useRouter();

  const handleEventCreated = useCallback(() => {
    // Refresh the page data
    router.refresh();
  }, [router]);

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* School Filter */}
        <EventsSchoolSelector schools={schools} />

        {/* Events List */}
        <EventsList
          events={initialEvents}
          schools={schools}
          onEventCreated={handleEventCreated}
        />
      </div>
    </div>
  );
};

export default EventsDashboardClient;
