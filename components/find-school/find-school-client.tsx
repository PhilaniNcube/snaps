"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  School,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  GraduationCap,
  Camera,
} from "lucide-react";
import { Database } from "@/utils/supabase/schema";

type School = Database["public"]["Tables"]["schools"]["Row"];
type Class = Database["public"]["Tables"]["classes"]["Row"];
type Event = Database["public"]["Tables"]["photo_shoot_events"]["Row"];

interface FindSchoolClientProps {
  schools: School[];
  classes: Class[];
  events: Event[];
}

const FindSchoolClient: React.FC<FindSchoolClientProps> = ({
  schools,
  classes,
  events,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter schools based on search term
  const filteredSchools = useMemo(() => {
    if (!searchTerm.trim()) return schools;

    return schools.filter(
      (school) =>
        school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.contact_person
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        school.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schools, searchTerm]);

  // Calculate stats for each school
  const schoolStats = useMemo(() => {
    const stats: Record<
      number,
      { classCount: number; eventCount: number; recentEvents: Event[] }
    > = {};

    schools.forEach((school) => {
      const schoolClasses = classes.filter(
        (c) => c.school_id === school.school_id
      );
      const schoolEvents = events.filter(
        (e) => e.school_id === school.school_id
      );
      const recentEvents = schoolEvents
        .filter((e) => e.shoot_date)
        .sort(
          (a, b) =>
            new Date(b.shoot_date!).getTime() -
            new Date(a.shoot_date!).getTime()
        )
        .slice(0, 3);

      stats[school.school_id] = {
        classCount: schoolClasses.length,
        eventCount: schoolEvents.length,
        recentEvents,
      };
    });

    return stats;
  }, [schools, classes, events]);
  const handleSchoolSelect = (schoolId: number) => {
    // Navigate to public galleries page with school filter
    router.push(`/galleries?school=${schoolId}`);
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search schools by name, contact, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center">
        <p className="text-gray-600">
          {filteredSchools.length === schools.length
            ? `Showing all ${schools.length} schools`
            : `Found ${filteredSchools.length} of ${schools.length} schools`}
        </p>
      </div>

      {/* Schools Grid */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school) => {
            const stats = schoolStats[school.school_id];

            return (
              <Card
                key={school.school_id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-0 shadow-lg bg-white/70 backdrop-blur-sm"
                onClick={() => handleSchoolSelect(school.school_id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {school.school_name}
                      </CardTitle>
                      {school.contact_person && (
                        <p className="text-sm text-gray-600 mt-1">
                          Contact: {school.contact_person}
                        </p>
                      )}
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <School className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    {school.contact_email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{school.contact_email}</span>
                      </div>
                    )}
                    {school.contact_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{school.contact_phone}</span>
                      </div>
                    )}
                    {school.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{school.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <GraduationCap className="h-4 w-4" />
                        <span className="font-semibold">
                          {stats?.classCount || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Classes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <Camera className="h-4 w-4" />
                        <span className="font-semibold">
                          {stats?.eventCount || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Photo Events</p>
                    </div>
                  </div>

                  {/* Recent Events */}
                  {stats?.recentEvents && stats.recentEvents.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Recent Events:
                      </p>
                      <div className="space-y-1">
                        {stats.recentEvents.map((event) => (
                          <div
                            key={event.event_id}
                            className="flex items-center gap-2"
                          >
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600 truncate">
                              {event.event_name}
                            </span>
                            {event.shoot_date && (
                              <Badge variant="secondary" className="text-xs">
                                {new Date(
                                  event.shoot_date
                                ).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View Photos Button */}
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 rounded-lg transition-all duration-200 group-hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSchoolSelect(school.school_id);
                    }}
                  >
                    View Photos
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* No Results */
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No schools found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any schools matching "{searchTerm}". Try a
            different search term.
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchTerm("")}
            className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Clear search
          </Button>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center pt-12 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          Can't find your school? Contact us to get your school added to our
          photo gallery system.
        </p>
      </div>
    </div>
  );
};

export default FindSchoolClient;
