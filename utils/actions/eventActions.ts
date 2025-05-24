"use server";

import { addEventSchema } from "@/lib/form-schemas";
import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function addEventAction(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  // Validate form data with proper type conversion
  const rawFormData = {
    event_name: formData.get("event_name"),
    order_deadline: formData.get("order_deadline")
      ? new Date(formData.get("order_deadline") as string)
      : undefined,
    shoot_date: formData.get("shoot_date")
      ? new Date(formData.get("shoot_date") as string)
      : undefined,
    photo_gallery_live_until: formData.get("photo_gallery_live_until")
      ? new Date(formData.get("photo_gallery_live_until") as string)
      : undefined,
    school_id: Number(formData.get("school_id")),
    notes: formData.get("notes"),
  };

  const validatedFields = addEventSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
      values: Object.fromEntries(formData),
    };
  }

  try {
    // Create insert data with proper typing
    const insertData: Database["public"]["Tables"]["photo_shoot_events"]["Insert"] =
      {
        school_id: validatedFields.data.school_id,
        event_name: validatedFields.data.event_name,
        shoot_date: validatedFields.data.shoot_date?.toISOString() || null,
        order_deadline:
          validatedFields.data.order_deadline?.toISOString() || null,
        photo_gallery_live_until:
          validatedFields.data.photo_gallery_live_until?.toISOString() || null,
        notes: validatedFields.data.notes || null,
      };

    const { data: eventData, error: eventError } = await supabase
      .from("photo_shoot_events")
      .insert(insertData)
      .select("*")
      .single();

    if (eventError) {
      return {
        success: false,
        message: "Failed to create event",
        error: eventError.message,
        values: validatedFields.data,
      };
    }

    revalidatePath("/dashboard/schools");

    return {
      success: true,
      message: "Event created successfully!",
      data: eventData,
      values: validatedFields.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
      values: validatedFields.data,
    };
  }
}
