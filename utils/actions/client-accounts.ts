"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { clientAccountUpdateSchema } from "@/lib/form-schemas";

export async function updateClientAccountAction(
  prevState: unknown,
  formData: FormData
) {
  // validate the inputs using clientAccountUpdateSchema
  const first_name = formData.get("first_name")?.toString();
  const last_name = formData.get("last_name")?.toString();
  const email = formData.get("email")?.toString();

  const validatedFields = clientAccountUpdateSchema.safeParse({
    first_name,
    last_name,
    email,
  });

  // if validation fails, return the failure reason as well as the original values in order to communicate to the form why a particular filed value might have failed
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      values: {
        first_name,
        last_name,
        email,
      },
    };
  }

  const supabase = await createClient();

  // get the current user
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // if user is not logged in, return null
  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const user = userData.user;

  if (!user) {
    return {
      success: false,
      error: "User not logged in",
      values: {
        first_name,
        last_name,
        email,
      },
    };
  }

  const { data, error } = await supabase
    .from("client_accounts")
    .update({ first_name, last_name, email })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error.message,
      values: {
        first_name,
        last_name,
        email,
      },
    };
  }

  // revalidate the path
  revalidatePath("/profile");

  return {
    success: true,
    error: null,
    values: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
    },
  };
}
