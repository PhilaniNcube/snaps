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
