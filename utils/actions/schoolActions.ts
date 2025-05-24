"use server";

import { createClient } from "@/utils/supabase/server";
import { createSchoolSchema } from "@/lib/form-schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CreateSchoolActionState {
  message: string;
  type: "idle" | "success" | "error";
  errors: Record<string, string[]> | null;
  data: Database["public"]["Tables"]["schools"]["Row"] | null;
}

export async function createSchoolAction(
  prevState: CreateSchoolActionState,
  formData: FormData
): Promise<CreateSchoolActionState> {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      message: "You must be logged in to create a school",
      type: "error",
      errors: null,
      data: null,
    };
  }

  // Validate form data
  const rawFormData = {
    school_name: formData.get("school_name"),
    contact_person: formData.get("contact_person"),
    contact_email: formData.get("contact_email"),
    contact_phone: formData.get("contact_phone"),
    address: formData.get("address"),
  };

  const validatedFields = createSchoolSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    // Insert school into database
    const { data: schoolData, error: schoolError } = await supabase
      .from("schools")
      .insert({
        school_name: validatedFields.data.school_name,
        contact_person: validatedFields.data.contact_person,
        contact_email: validatedFields.data.contact_email,
        contact_phone: validatedFields.data.contact_phone,
        address: validatedFields.data.address,
      })
      .select("*")
      .single();

    if (schoolError) {
      return {
        message: "Failed to create school. Please try again.",
        type: "error",
        errors: null,
        data: null,
      };
    }

    // Revalidate the schools list
    revalidatePath("/dashboard");

    return {
      message: "School created successfully!",
      type: "success",
      errors: null,
      data: schoolData,
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
