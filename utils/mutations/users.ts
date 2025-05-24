"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function updateProfile(first_name: string, last_name: string) {
  // validate the inputs
  if (!first_name || !last_name) {
    return null;
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
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ first_name, last_name })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  // revalidate the path
  revalidatePath("/profile");

  return data;
}

export async function updateClientAccount(
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string
) {
  // validate the inputs
  if (!first_name || !last_name || !email || !phone_number) {
    return null;
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
    return null;
  }

  const { data, error } = await supabase
    .from("client_accounts")
    .update({ first_name, last_name, email, phone_number })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  // revalidate the path
  revalidatePath("/profile");

  return data;
}
