"use server";

import { createClient } from "@/utils/supabase/server";
import { addClassSchema } from "@/lib/form-schemas";
import { revalidatePath } from "next/cache";

export interface CreateClassActionState {
  message: string;
  type: "idle" | "success" | "error";
  errors: Record<string, string[]> | null;
  data: Database["public"]["Tables"]["classes"]["Row"] | null;
}

export async function createClassAction(
  prevState: CreateClassActionState,
  formData: FormData
): Promise<CreateClassActionState> {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      message: "You must be logged in to create a class",
      type: "error",
      errors: null,
      data: null,
    };
  }

  // Validate form data
  const rawFormData = {
    school_id: formData.get("school_id"),
    class_name: formData.get("class_name"),
    event_id: formData.get("event_id"),
    teacher_name: formData.get("teacher_name"),
    academic_year: formData.get("academic_year"),
  };

  const validatedFields = addClassSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    // Insert class into database
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .insert({
        school_id: validatedFields.data.school_id,
        class_name: validatedFields.data.class_name,
        event_id: validatedFields.data.event_id || null,
        teacher_name: validatedFields.data.teacher_name,
        academic_year: validatedFields.data.academic_year,
      })
      .select("*")
      .single();

    if (classError) {
      return {
        message: "Failed to create class. Please try again.",
        type: "error",
        errors: null,
        data: null,
      };
    }

    // Revalidate the classes list
    revalidatePath("/dashboard");
    revalidatePath("/schools");

    return {
      message: "Class created successfully!",
      type: "success",
      errors: null,
      data: classData,
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
