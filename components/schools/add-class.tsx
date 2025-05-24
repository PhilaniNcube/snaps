"use client";

import React, { startTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { addClassSchema, type AddClassFormValues } from "@/lib/form-schemas";

import { Loader2 } from "lucide-react";
import {
  createClassAction,
  CreateClassActionState,
} from "@/utils/actions/classActions";

const initialState: CreateClassActionState = {
  message: "",
  type: "idle",
  errors: null,
  data: null,
};

interface AddClassProps {
  schoolId: number;
  onSuccess?: () => void;
}

const AddClass: React.FC<AddClassProps> = ({ schoolId, onSuccess }) => {
  const [state, formAction, isPending] = useActionState(
    createClassAction,
    initialState
  );

  const form = useForm<AddClassFormValues>({
    resolver: zodResolver(addClassSchema),
    defaultValues: {
      school_id: schoolId,
      class_name: "",
      teacher_name: "",
      academic_year: new Date().getFullYear(),
      event_id: undefined,
    },
  });

  // Handle form submission
  const onSubmit = (data: AddClassFormValues) => {
    const formData = new FormData();
    formData.append("school_id", data.school_id.toString());
    formData.append("class_name", data.class_name);
    formData.append("teacher_name", data.teacher_name);
    formData.append("academic_year", data.academic_year.toString());
    if (data.event_id) {
      formData.append("event_id", data.event_id.toString());
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle server action responses
  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      form.reset({
        school_id: schoolId,
        class_name: "",
        teacher_name: "",
        academic_year: new Date().getFullYear(),
        event_id: undefined,
      });
      onSuccess?.();
    } else if (state.type === "error") {
      toast.error(state.message);

      // Set field errors if available
      if (state.errors) {
        Object.entries(state.errors).forEach(([field, messages]) => {
          form.setError(field as keyof AddClassFormValues, {
            message: messages[0],
          });
        });
      }
    }
  }, [state, form, schoolId, onSuccess]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Add New Class</CardTitle>
        <CardDescription>Create a new class for this school</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="class_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Grade 5A, Year 1 Blue"
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
              name="teacher_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter teacher's full name"
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
              name="academic_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 2024"
                      {...field}
                      disabled={isPending}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter event ID if applicable"
                      {...field}
                      value={field.value ?? ""}
                      disabled={isPending}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
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
                  Creating Class...
                </>
              ) : (
                "Create Class"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddClass;
