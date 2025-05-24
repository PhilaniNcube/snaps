import { createClient } from "../supabase/server";

export async function getClientAccount() {
  const supabase = await createClient();
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

  const { data: accountData, error: accountError } = await supabase
    .from("client_accounts")
    .select("*")
    .eq("id", user.id)
    .single();

  if (accountError) {
    console.error("Error fetching account:", accountError);
    return null;
  }

  return accountData;
}

// get the current session
export async function getCurrentSession() {
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return null;
  }

  return sessionData.session;
}

// get the current profile
export async function getCurrentProfile() {
  const supabase = await createClient();
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

  const { data: profileData, error: profileError } = await supabase
    .from("client_accounts")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return null;
  }

  return profileData;
}

// check if the user is a photographer_admin
export async function isPhotographerAdmin() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // if user is not logged in, return false
  if (userError) {
    console.error("Error fetching user:", userError);
    return false;
  }
  const user = userData.user;

  if (!user) {
    return false;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("client_accounts")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return false;
  }

  if (!profileData) {
    console.error("Profile data not found for user:", user.id);
    return false;
  }

  // Check if the user is a photographer admin
  if (profileData.app_role !== "photographer_admin") {
    console.error("User is not a photographer admin:", user.id);
    return false;
  }

  // Return true if the user is a photographer admin
  if (profileData.app_role === "photographer_admin") {
    return true;
  }

  return false;
}
