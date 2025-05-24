import { createClient } from "@/utils/supabase/server";

export async function getAllEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photo_shoot_events")
    .select(
      `
      *,
      schools (
        school_id,
        school_name
      )
    `
    )
    .order("shoot_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data;
}

export async function getEventsBySchool(schoolId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photo_shoot_events")
    .select("*")
    .eq("school_id", schoolId)
    .order("shoot_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data;
}

export async function getEventById(eventId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photo_shoot_events")
    .select("*")
    .eq("event_id", eventId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data;
}
