"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { useActionState } from "react";
import { updateClientAccountAction } from "@/utils/actions/client-accounts";
import { clientAccountUpdateSchema } from "@/lib/form-schemas";
import { Input } from "./ui/input";
import { CircleDashed } from "lucide-react";

type ComponentProps = {
  clientAccount: Database["public"]["Tables"]["client_accounts"]["Row"];
};

// Define the initial state type based on your server action return type
const initialState = {
  success: false,
  error: {},
  values: {},
};

export default function UpdateClientAccountForm({
  clientAccount,
}: ComponentProps) {
  const [state, formAction, isPending] = useActionState(
    updateClientAccountAction,
    null
  );

  const form = useForm({
    resolver: zodResolver(clientAccountUpdateSchema),
    defaultValues: {
      first_name: clientAccount.first_name || "",
      last_name: clientAccount.last_name || "",
      email: clientAccount.email,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form action={formAction}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} value={field.value ?? ""} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} value={field.value ?? ""} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value ?? ""} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="relative" disabled={isPending}>
              {isPending && (
                <CircleDashed className="absolute left-1/2 -translate-x-1/2 animate-spin" />
              )}
              {isPending ? "Updating..." : "Update Account"}
            </Button>
          </div>
          {state?.success === true && (
            <p className="text-sm font-medium text-green-500">
              Client account updated successfully!
            </p>
          )}
          {state?.success === false && state?.error && (
            <p className="text-sm font-medium text-red-500">
              {JSON.stringify(state.error)}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
