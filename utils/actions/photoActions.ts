"use server";

import { uploadPhotoSchema } from "@/lib/form-schemas";
import { uploadPhoto } from "../mutations/photos";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function uploadPhotoAction(
  prevState: unknown,
  formData: FormData
) {
  // Validate the form data using Zod safeParse
  const validatedFields = uploadPhotoSchema.safeParse({
    student_id: formData.get("student_id"),
    class_id: formData.get("class_id"),
    photo_reference_code: formData.get("photo_reference_code"),
    image_url: formData.get("image_url"),
    thumbnail_url: formData.get("thumbnail_url"),
    is_class_photo: formData.get("is_class_photo") === "true",
    is_public_in_gallery: formData.get("is_public_in_gallery") === "true",
    event_id: formData.get("event_id"),
  });

  console.log("Class Photo:", formData.get("is_class_photo"));

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      values: Object.fromEntries(formData),
    };
  }

  const {
    event_id,
    student_id,
    class_id,
    photo_reference_code,
    image_url,
    thumbnail_url,
    is_class_photo,
    is_public_in_gallery,
  } = validatedFields.data;

  console.log("Uploading photo with data:", validatedFields.data);

  const supabase = await createClient();

  // Create two different insert objects based on whether event_id is provided
  const baseInsertData = {
    student_id: Number(student_id),
    class_id: Number(class_id),
    photo_reference_code,
    image_url: image_url!,
    thumbnail_url: thumbnail_url || null,
    is_class_photo,
    is_public_in_gallery,
  };

  const insertData: Database["public"]["Tables"]["photos"]["Insert"] = event_id
    ? {
        ...baseInsertData,
        event_id: Number(event_id),
      }
    : baseInsertData;

  const { data, error } = await supabase
    .from("photos")
    .insert(insertData)
    .select("*");

  if (error) {
    return {
      success: false,
      message: "Failed to upload photo",
      error: error.message,
      values: validatedFields.data,
    };
  }

  revalidatePath("/dashboard/upload");

  return {
    success: true,
    message: "Photo uploaded successfully!",
    data: data,
    values: validatedFields.data,
  };
}
