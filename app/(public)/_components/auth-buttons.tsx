import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getClientAccount } from "@/utils/queries/users";
import { UserDropdown } from "./user-dropdown";

export async function AuthButtons() {
  // get the current session in order to determin if the user is logged in or not and which buttons to show
  const userProfile = await getClientAccount();

  return (
    <div className="flex items-center gap-4">
      {userProfile === null ? (
        <>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" className="w-full">
              Sign Up
            </Button>
          </Link>
        </>
      ) : (
        <>
          <UserDropdown
            first_name={userProfile.first_name || userProfile.email || ""}
            last_name={userProfile.last_name || ""}
            email={userProfile.email || ""}
          />
        </>
      )}
    </div>
  );
}
