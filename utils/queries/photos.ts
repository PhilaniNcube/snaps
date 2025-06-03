import { createClient } from "../supabase/server";

// get a photo by it's photo_reference_code
export async function getPhotoByReferenceCode(photo_reference_code: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("photo_reference_code", photo_reference_code)
    .single();

  if (error) {
    console.error("Error fetching photo by reference code:", error);
    return null;
  }

  return data;
}

// get all photos for a class
export async function getPhotosByClassId(classId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos by class ID:", error);
    return [];
  }

  return data;
}

// get all photos for a student
export async function getPhotosByStudentId(studentId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos by student ID:", error);
    return [];
  }

  return data;
}

// get all photos for a school
export async function getPhotosBySchoolId(schoolId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos by school ID:", error);
    return [];
  }

  return data;
}

// get all photos for an event
export async function getPhotosByEventId(eventId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos by event ID:", error);
    return [];
  }

  return data;
}

// get all photos, within a specific date range
export async function getPhotosByDateRange(startDate: string, endDate: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .gte("created_at", startDate)
    .lte("created_at", endDate)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos by date range:", error);
    return [];
  }

  return data;
}

// get paginated photos
export async function getPaginatedPhotos(page: number, pageSize: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching paginated photos:", error);
    return [];
  }

  return data;
}

// get paginated photos with filters
export async function getPaginatedPhotosWithFilters({
  page,
  pageSize,
  schoolId,
  classId,
  eventId,
  isPublicOnly = true,
}: {
  page: number;
  pageSize: number;
  schoolId?: number;
  classId?: number;
  eventId?: number;
  isPublicOnly?: boolean;
}) {
  const supabase = await createClient();

  let query = supabase.from("photos").select(`
      *,
      classes (
        class_name,
        teacher_name,
        schools (
          school_name
        )
      ),
      photo_shoot_events (
        event_name,
        shoot_date
      )
    `);

  // Apply filters
  if (isPublicOnly) {
    query = query.eq("is_public_in_gallery", true);
  }

  if (schoolId) {
    query = query.eq("classes.school_id", schoolId);
  }

  if (classId) {
    query = query.eq("class_id", classId);
  }

  if (eventId) {
    query = query.eq("event_id", eventId);
  }

  // Apply pagination and ordering
  query = query
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order("uploaded_at", { ascending: false });

  const { data, error } = await query;

  let totalCount = 0;
  if (!error && data) {
    totalCount = data.length;
  }

  const { data: photos, error: photosError, count } = await query;

  if (photosError) {
    console.error("Error fetching paginated photos with filters:", photosError);
    return { photos: [], totalCount: count, totalPages: 0 };
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    photos: photos || [],
    totalCount,
    totalPages,
  };
}

// Simplified version without the count function for now
export async function getPaginatedPhotosWithFiltersSimple({
  page,
  pageSize,
  schoolId,
  classId,
  eventId,
  isPublicOnly = true,
}: {
  page: number;
  pageSize: number;
  schoolId?: number;
  classId?: number;
  eventId?: number;
  isPublicOnly?: boolean;
}) {
  const supabase = await createClient();

  let query = supabase.from("photos").select(
    `
      *,
      classes!inner (
        class_name,
        teacher_name,
        school_id,
        schools (
          school_name
        )
      ),
      photo_shoot_events (
        event_name,
        shoot_date
      )
    `,
    {
      count: "exact",
    }
  );

  // Apply filters
  if (isPublicOnly) {
    query = query.eq("is_public_in_gallery", true);
  }

  if (schoolId) {
    query = query.eq("classes.school_id", schoolId);
  }

  if (classId) {
    query = query.eq("class_id", classId);
  }

  if (eventId) {
    query = query.eq("event_id", eventId);
  }

  // Apply pagination and ordering
  query = query
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order("uploaded_at", { ascending: false });

  const { data: photos, error: photosError, count } = await query;

  if (photosError) {
    console.error("Error fetching paginated photos with filters:", photosError);
    return { photos: [], hasMore: false };
  }

  const hasMore = (count || 0) === pageSize;

  return {
    photos: photos || [],
    hasMore,
  };
}

// write a function to get 4 images for the featured images for the homepage
export async function getFeaturedPhotos(limit: number = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*", { count: "exact" })
    .order("uploaded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured photos:", error);
    return [];
  }

  return data;
}
