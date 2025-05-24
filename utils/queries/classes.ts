import { createClient } from "@/utils/supabase/server";

export async function getClassesBySchool(schoolId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("school_id", schoolId)
    .order("class_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch classes: ${error.message}`);
  }

  return data;
}

export async function getClassById(classId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch class: ${error.message}`);
  }

  return data;
}

export async function getAllClasses() {
  const supabase = await createClient();
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from("classes")
    .select(
      `
      *,
      schools (
        school_id,
        school_name
      )
    `
    )
    .eq("academic_year", currentYear)
    .order("class_name", { ascending: true });

  if (error) {
    console.log("Error fetching classes:", error);
    throw new Error(`Failed to fetch classes: ${error.message}`);
  }

  return data;
}
