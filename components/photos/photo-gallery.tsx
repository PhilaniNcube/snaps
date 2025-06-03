"use client";

import React from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Image as ImageIcon,
  Calendar,
  School,
  GraduationCap,
  X,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Photo = Database["public"]["Tables"]["photos"]["Row"] & {
  classes?: {
    class_name: string;
    teacher_name: string | null;
    school_id: number;
    schools: {
      school_name: string;
    } | null;
  } | null;
  photo_shoot_events?: {
    event_name: string;
    shoot_date: string | null;
  } | null;
};

type PhotoGalleryProps = {
  initialPhotos: Photo[];
  schools: Database["public"]["Tables"]["schools"]["Row"][];
  classes: Database["public"]["Tables"]["classes"]["Row"][];
  events: Database["public"]["Tables"]["photo_shoot_events"]["Row"][];
  hasMore: boolean;
  showBackToFindSchool?: boolean;
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  initialPhotos,
  schools,
  classes,
  events,
  hasMore: initialHasMore,
  showBackToFindSchool = false,
}) => {
  // URL state management
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [schoolId, setSchoolId] = useQueryState("school", parseAsInteger);
  const [classId, setClassId] = useQueryState("class", parseAsInteger);
  const [eventId, setEventId] = useQueryState("event", parseAsInteger);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );

  // Local state
  const [photos, setPhotos] = React.useState<Photo[]>(initialPhotos);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initialHasMore);
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null);

  // Filter options based on selected school
  const filteredClasses = React.useMemo(() => {
    if (!schoolId) return classes;
    return classes.filter((c) => c.school_id === schoolId);
  }, [schoolId, classes]);

  const filteredEvents = React.useMemo(() => {
    if (!schoolId) return events;
    return events.filter((e) => e.school_id === schoolId);
  }, [schoolId, events]);

  // Fetch photos when filters change
  const fetchPhotos = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("pageSize", "12");

      if (schoolId) params.set("schoolId", schoolId.toString());
      if (classId) params.set("classId", classId.toString());
      if (eventId) params.set("eventId", eventId.toString());
      if (search) params.set("search", search);

      const response = await fetch(`/api/photos?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch photos");

      const data = await response.json();
      setPhotos(data.photos);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  }, [page, schoolId, classId, eventId, search]);

  // Effect to fetch photos when filters change
  React.useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Reset class and event when school changes
  React.useEffect(() => {
    if (schoolId && classId) {
      const isClassInSchool = filteredClasses.some(
        (c) => c.class_id === classId
      );
      if (!isClassInSchool) {
        setClassId(null);
      }
    }
    if (schoolId && eventId) {
      const isEventInSchool = filteredEvents.some(
        (e) => e.event_id === eventId
      );
      if (!isEventInSchool) {
        setEventId(null);
      }
    }
  }, [
    schoolId,
    classId,
    eventId,
    filteredClasses,
    filteredEvents,
    setClassId,
    setEventId,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSchoolId(null);
    setClassId(null);
    setEventId(null);
    setSearch("");
    setPage(1);
  };

  // Handle pagination
  const goToPage = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFiltersCount = [schoolId, classId, eventId, search].filter(
    Boolean
  ).length;
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      {showBackToFindSchool && (
        <div className="flex items-center gap-4">
          <Link href="/find-school">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Find School
            </Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Photo Galleries</h1>
          <p className="text-muted-foreground">
            Browse photos from schools, classes, and events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {photos.length} photos
          </Badge>
          {activeFiltersCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter photos by school, class, event, or search terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* School Filter */}{" "}
            <div className="space-y-2 w-sm max-w-sm">
              <label className="text-sm font-medium flex items-center gap-2">
                <School className="h-4 w-4" />
                School
              </label>
              <Select
                value={schoolId?.toString()}
                onValueChange={(value) => {
                  setSchoolId(value ? parseInt(value) : null);
                  setPage(1);
                }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue className="text-xs" placeholder="All schools" />
                </SelectTrigger>
                <SelectContent className="max-w-sm">
                  {schools.map((school) => (
                    <SelectItem
                      key={school.school_id}
                      value={school.school_id.toString()}
                    >
                      {school.school_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Class Filter */}
            <div className="space-y-2 w-sm max-w-sm">
              <label className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Class
              </label>{" "}
              <Select
                value={classId?.toString()}
                onValueChange={(value) => {
                  setClassId(value ? parseInt(value) : null);
                  setPage(1);
                }}
                disabled={!schoolId && classes.length > 20}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent className="max-w-sm text-xs">
                  {filteredClasses.map((classItem) => (
                    <SelectItem
                      key={classItem.class_id}
                      value={classItem.class_id.toString()}
                    >
                      {classItem.class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Event Filter */}
            <div className="space-y-2 w-sm max-w-sm overflow-hidden">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Event
              </label>{" "}
              <Select
                value={eventId?.toString()}
                onValueChange={(value) => {
                  setEventId(value ? parseInt(value) : null);
                  setPage(1);
                }}
                disabled={!schoolId && events.length > 20}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent className="max-w-sm">
                  {filteredEvents.map((event) => (
                    <SelectItem
                      key={event.event_id}
                      value={event.event_id.toString()}
                    >
                      {event.event_name}
                      {event.shoot_date &&
                        ` (${new Date(event.shoot_date).toLocaleDateString()})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Search */}
            <div className="space-y-2 max-w-sm">
              <label className="text-sm font-medium flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </label>
              <Input
                placeholder="Search photos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="text-xs"
              />
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {schoolId && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    School:{" "}
                    {schools.find((s) => s.school_id === schoolId)?.school_name}
                    <button onClick={() => setSchoolId(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {classId && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Class:{" "}
                    {classes.find((c) => c.class_id === classId)?.class_name}
                    <button onClick={() => setClassId(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {eventId && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Event:{" "}
                    {events.find((e) => e.event_id === eventId)?.event_name}
                    <button onClick={() => setEventId(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {search && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: "{search}"
                    <button onClick={() => setSearch("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card
              key={photo.photo_id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET}${photo.image_url}`}
                  alt={`Photo ${photo.photo_reference_code}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {photo.is_class_photo && (
                  <Badge className="absolute top-2 right-2">Class Photo</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="font-medium text-sm">
                    Photo Reference Code <br />
                    <Badge>{photo.photo_reference_code}</Badge>
                  </p>
                  {photo.classes && (
                    <p className="text-sm text-muted-foreground">
                      {photo.classes.class_name}
                      {photo.classes.schools && (
                        <> • {photo.classes.schools.school_name}</>
                      )}
                    </p>
                  )}
                  {photo.photo_shoot_events && (
                    <p className="text-sm text-muted-foreground">
                      📅 {photo.photo_shoot_events.event_name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No photos found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {photos.length > 0 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-muted-foreground">Page {page}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={!hasMore || loading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Photo Modal/Preview */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
            <div className="relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET}${selectedPhoto.image_url}`}
                alt={`Photo ${selectedPhoto.photo_reference_code}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-2">
                Photo Reference Code{" "}
                <Badge>{selectedPhoto.photo_reference_code}</Badge>
              </h3>
              {selectedPhoto.classes && (
                <p className="text-muted-foreground">
                  Class: {selectedPhoto.classes.class_name}
                  {selectedPhoto.classes.schools && (
                    <> • School: {selectedPhoto.classes.schools.school_name}</>
                  )}
                </p>
              )}
              {selectedPhoto.photo_shoot_events && (
                <p className="text-muted-foreground">
                  Event: {selectedPhoto.photo_shoot_events.event_name}
                  {selectedPhoto.photo_shoot_events.shoot_date && (
                    <>
                      {" "}
                      • Date:{" "}
                      {new Date(
                        selectedPhoto.photo_shoot_events.shoot_date
                      ).toLocaleDateString()}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
