import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UpdateClientAccountForm from "@/components/update-client-account-form";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("client_accounts")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    redirect("/auth/login");
  }
  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <UpdateClientAccountForm clientAccount={profile} />
    </div>
  );
}
