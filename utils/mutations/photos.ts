"use server";

import { createClient } from "../supabase/server";

export async function uploadPhoto(
  event_id: number,
  student_id: number,
  class_id: number,
  photo_reference_code: string,
  image_url: string,
  thumbnail_url: string | null,
  is_class_photo: boolean,
  is_public_in_gallery: boolean
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .insert({
      event_id,
      student_id,
      class_id,
      photo_reference_code,
      image_url,
      thumbnail_url,
      is_class_photo,
      is_public_in_gallery,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error uploading photo:", error);
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Photo uploaded successfully",
    data,
  };
}
