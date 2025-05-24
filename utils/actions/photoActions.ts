"use server";

import { uploadPhotoSchema } from "@/lib/form-schemas";
import { uploadPhoto } from "../mutations/photos";
import { revalidatePath } from "next/cache";

export async function uploadPhotoAction(
  prevState: unknown,
  formData: FormData
) {
  const validatedFields = uploadPhotoSchema.safeParse({
    event_id: formData.get("event_id")?.toString(),
    student_id: formData.get("student_id")?.toString(),
    class_id: formData.get("class_id")?.toString(),
    photo_reference_code: formData.get("photo_reference_code")?.toString(),
    image_url: formData.get("image_url")?.toString(),
    thumbnail_url: formData.get("thumbnail_url")?.toString(),
    is_class_photo: formData.get("is_class_photo") === "on",
    is_public_in_gallery: formData.get("is_public_in_gallery") === "on",
  });

  // if validation fails, return the failure reason as well as the original values in order to communicate to the form why a particular filed value might have failed
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      values: {
        event_id: formData.get("event_id")?.toString(),
        student_id: formData.get("student_id")?.toString(),
        class_id: formData.get("class_id")?.toString(),
        photo_reference_code: formData.get("photo_reference_code")?.toString(),
        image_url: formData.get("image_url")?.toString(),
        thumbnail_url: formData.get("thumbnail_url")?.toString(),
        is_class_photo: formData.get("is_class_photo") === "on",
        is_public_in_gallery: formData.get("is_public_in_gallery") === "on",
      },
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

  const result = await uploadPhoto(
    Number(event_id),
    Number(student_id),
    Number(class_id),
    photo_reference_code,
    image_url,
    thumbnail_url,
    is_class_photo,
    is_public_in_gallery
  );

  if (!result.success) {
    return {
      success: false,
      error: result.message,
      values: validatedFields.data,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: result.message,
    data: result.data,
    values: validatedFields.data,
  };
}
