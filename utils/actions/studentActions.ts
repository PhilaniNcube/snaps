"use server";

import { createClient } from "@/utils/supabase/server";
import { addStudentSchema } from "@/lib/form-schemas";
import { revalidatePath } from "next/cache";

export interface AddStudentActionState {
  message: string;
  type: "idle" | "success" | "error";
  errors: Record<string, string[]> | null;
  data: Database["public"]["Tables"]["students"]["Row"] | null;
}

export async function addStudentAction(
  prevState: AddStudentActionState,
  formData: FormData
): Promise<AddStudentActionState> {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      message: "You must be logged in to add a student",
      type: "error",
      errors: null,
      data: null,
    };
  }

  // Validate form data
  const rawFormData = {
    class_id: formData.get("class_id"),
    student_name: formData.get("student_name"),
    parent_name_on_form: formData.get("parent_name_on_form"),
    parent_cell_on_form: formData.get("parent_cell_on_form"),
    parent_email_on_form: formData.get("parent_email_on_form"),
    student_reference_id: formData.get("student_reference_id") || undefined,
  };

  const validatedFields = addStudentSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    // Insert student into database
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .insert({
        class_id: validatedFields.data.class_id,
        student_name: validatedFields.data.student_name,
        parent_name_on_form: validatedFields.data.parent_name_on_form,
        parent_cell_on_form: validatedFields.data.parent_cell_on_form,
        parent_email_on_form: validatedFields.data.parent_email_on_form,
        student_reference_id: validatedFields.data.student_reference_id,
      })
      .select()
      .single();

    if (studentError) {
      return {
        message: "Failed to add student. Please try again.",
        type: "error",
        errors: null,
        data: null,
      };
    }

    // Revalidate the students list
    revalidatePath("/students");
    revalidatePath(`/classes/${validatedFields.data.class_id}`);

    return {
      message: "Student added successfully!",
      type: "success",
      errors: null,
      data: studentData,
    };
  } catch (error) {
    return {
      message: "An unexpected error occurred. Please try again.",
      type: "error",
      errors: null,
      data: null,
    };
  }
}
