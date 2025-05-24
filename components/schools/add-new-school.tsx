"use client";

import React, { startTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  createSchoolSchema,
  type CreateSchoolFormValues,
} from "@/lib/form-schemas";

import { Loader2 } from "lucide-react";
import {
  createSchoolAction,
  CreateSchoolActionState,
} from "@/utils/actions/schoolActions";

const initialState: CreateSchoolActionState = {
  message: "",
  type: "idle",
  errors: null,
  data: null,
};

interface AddNewSchoolProps {
  onSuccess?: () => void;
}

const AddNewSchool: React.FC<AddNewSchoolProps> = ({ onSuccess }) => {
  const [state, formAction, isPending] = useActionState(
    createSchoolAction,
    initialState
  );

  const form = useForm<CreateSchoolFormValues>({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      school_name: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      address: "",
    },
  });
  // Handle server action state changes
  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      form.reset(); // Reset form on success
      onSuccess?.(); // Call onSuccess callback if provided
    } else if (state.type === "error") {
      toast.error(state.message);

      // Set server-side validation errors
      if (state.errors) {
        Object.entries(state.errors).forEach(([field, messages]) => {
          form.setError(field as keyof CreateSchoolFormValues, {
            type: "server",
            message: messages[0],
          });
        });
      }
    }
  }, [state, form, onSuccess]);

  const onSubmit = async (data: CreateSchoolFormValues) => {
    // Create FormData for server action
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Call server action
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Add New School</CardTitle>
        <CardDescription>
          Enter the school details to add it to the database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="school_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter school name"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact person name"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@school.edu"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter school address"
                      rows={3}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating School...
                </>
              ) : (
                "Create School"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddNewSchool;
