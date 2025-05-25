"use client";

import React from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { format, isBefore, isAfter, differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Camera,
  Clock,
  FileImage,
  MapPin,
  AlertCircle,
  CheckCircle,
  School,
  Users,
  CalendarDays,
} from "lucide-react";
import { Database } from "@/utils/supabase/schema";

type Event = Database["public"]["Tables"]["photo_shoot_events"]["Row"] & {
  schools?: {
    school_id: number;
    school_name: string;
  } | null;
};

type School = Database["public"]["Tables"]["schools"]["Row"];

interface EventsListProps {
  events: Event[];
  schools: School[];
}

const EventsList: React.FC<EventsListProps> = ({ events, schools }) => {
  const [selectedSchoolId, setSelectedSchoolId] = useQueryState(
    "school",
    parseAsInteger
  );

  // Filter events based on selected school
  const filteredEvents = selectedSchoolId
    ? events.filter((event) => event.school_id === selectedSchoolId)
    : events;

  // Categorize events
  const today = new Date();
  const upcomingEvents = filteredEvents.filter(
    (event) => event.shoot_date && isAfter(new Date(event.shoot_date), today)
  );
  const pastEvents = filteredEvents.filter(
    (event) => event.shoot_date && isBefore(new Date(event.shoot_date), today)
  );
  const overdueOrders = filteredEvents.filter(
    (event) =>
      event.order_deadline && isBefore(new Date(event.order_deadline), today)
  );

  // Statistics
  const totalEvents = filteredEvents.length;
  const schoolName = selectedSchoolId
    ? schools.find((school) => school.school_id === selectedSchoolId)
        ?.school_name
    : null;

  const getEventStatus = (event: Event) => {
    const now = new Date();

    if (!event.shoot_date) return { status: "pending", color: "secondary" };

    const shootDate = new Date(event.shoot_date);
    const orderDeadline = event.order_deadline
      ? new Date(event.order_deadline)
      : null;
    const galleryDeadline = event.photo_gallery_live_until
      ? new Date(event.photo_gallery_live_until)
      : null;

    if (isBefore(shootDate, now)) {
      if (galleryDeadline && isAfter(galleryDeadline, now)) {
        return { status: "gallery-live", color: "default" };
      }
      return { status: "completed", color: "secondary" };
    }

    if (orderDeadline && isBefore(orderDeadline, now)) {
      return { status: "orders-closed", color: "destructive" };
    }

    const daysUntilShoot = differenceInDays(shootDate, now);
    if (daysUntilShoot <= 7) {
      return { status: "upcoming", color: "destructive" };
    }

    return { status: "scheduled", color: "default" };
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "scheduled":
        return "Scheduled";
      case "upcoming":
        return "This Week";
      case "orders-closed":
        return "Orders Closed";
      case "gallery-live":
        return "Gallery Live";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };
  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const eventStatus = getEventStatus(event);
    const school =
      schools.find((s) => s.school_id === event.school_id) ||
      (event.schools
        ? {
            school_id: event.schools.school_id,
            school_name: event.schools.school_name,
          }
        : null);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5" />
                {event.event_name}
              </CardTitle>
              {school && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <School className="h-4 w-4" />
                  {school.school_name}
                </p>
              )}
            </div>
            <Badge variant={eventStatus.color as any}>
              {getStatusLabel(eventStatus.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Event Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {event.shoot_date && (
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Shoot Date</p>
                    <p className="text-muted-foreground">
                      {format(new Date(event.shoot_date), "PPP")}
                    </p>
                  </div>
                </div>
              )}

              {event.order_deadline && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-medium">Order Deadline</p>
                    <p className="text-muted-foreground">
                      {format(new Date(event.order_deadline), "PPP")}
                    </p>
                  </div>
                </div>
              )}

              {event.photo_gallery_live_until && (
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Gallery Until</p>
                    <p className="text-muted-foreground">
                      {format(new Date(event.photo_gallery_live_until), "PPP")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {event.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="font-medium">Notes:</span> {event.notes}
                </p>
              </div>
            )}

            {/* Event Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Event ID: {event.event_id}</span>
              {event.created_at && (
                <span>Created: {format(new Date(event.created_at), "PP")}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with School Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Photo Shoot Events</h1>
          <p className="text-muted-foreground">
            {selectedSchoolId && schoolName
              ? `Events for ${schoolName}`
              : "All photo shoot events across schools"}
          </p>
        </div>
        {selectedSchoolId && (
          <Button variant="outline" onClick={() => setSelectedSchoolId(null)}>
            View All Schools
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {selectedSchoolId ? `For ${schoolName}` : "Across all schools"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {upcomingEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">Future shoot dates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pastEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">Completed shoots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Orders
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueOrders.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Past order deadlines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-6">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingEvents
                  .sort(
                    (a, b) =>
                      new Date(a.shoot_date!).getTime() -
                      new Date(b.shoot_date!).getTime()
                  )
                  .map((event) => (
                    <EventCard key={event.event_id} event={event} />
                  ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Past Events ({pastEvents.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pastEvents
                  .sort(
                    (a, b) =>
                      new Date(b.shoot_date!).getTime() -
                      new Date(a.shoot_date!).getTime()
                  )
                  .slice(0, 6) // Show only the 6 most recent past events
                  .map((event) => (
                    <EventCard key={event.event_id} event={event} />
                  ))}
              </div>
              {pastEvents.length > 6 && (
                <div className="text-center mt-4">
                  <Button variant="outline">
                    View All Past Events ({pastEvents.length - 6} more)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {selectedSchoolId
                  ? "No Events for This School"
                  : "No Events Found"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                {selectedSchoolId
                  ? `${schoolName} doesn't have any photo shoot events scheduled yet.`
                  : "There are no photo shoot events in the system yet. Create your first event to get started."}
              </p>
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventsList;
