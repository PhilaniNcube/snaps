import { createClient } from "@/utils/supabase/server";

export async function getAllSchools() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("school_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch schools: ${error.message}`);
  }

  return data;
}

export async function getSchoolById(schoolId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("school_id", schoolId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch school: ${error.message}`);
  }

  return data;
}

export async function getSchoolsWithClasses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schools")
    .select(
      `
      *,
      classes (
        class_id,
        class_name,
        teacher_name,
        academic_year
      )
    `
    )
    .order("school_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch schools with classes: ${error.message}`);
  }

  return data;
}
