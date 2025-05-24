import { createClient } from "@/utils/supabase/server";

export async function getStudentsByClass(classId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("class_id", classId)
    .order("student_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch students: ${error.message}`);
  }

  return data;
}

export async function getAllStudents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(
      `
      *,
      classes (
        class_id,
        class_name,
        schools (
          school_id,
          school_name
        )
      )
    `
    )
    .order("student_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch students: ${error.message}`);
  }

  return data;
}

export async function getStudentById(studentId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("student_id", studentId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch student: ${error.message}`);
  }

  return data;
}
