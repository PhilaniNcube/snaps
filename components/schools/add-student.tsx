"use client";

import React, { useEffect } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  addStudentSchema,
  type AddStudentFormValues,
} from "@/lib/form-schemas";

import { Loader2, UserPlus } from "lucide-react";
import {
  addStudentAction,
  AddStudentActionState,
} from "@/utils/actions/studentActions";

interface AddStudentProps {
  classes: Database["public"]["Tables"]["classes"]["Row"][];
  defaultClassId?: number;
}

const initialState: AddStudentActionState = {
  message: "",
  type: "idle",
  errors: null,
  data: null,
};

const AddStudent: React.FC<AddStudentProps> = ({ classes, defaultClassId }) => {
  const [state, formAction, isPending] = useActionState(
    addStudentAction,
    initialState
  );

  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      class_id: defaultClassId || 0,
      student_name: "",
      parent_name_on_form: "",
      parent_cell_on_form: "",
      parent_email_on_form: "",
      student_reference_id: "",
    },
  });

  // Handle server action state changes
  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      form.reset({
        class_id: defaultClassId || 0,
        student_name: "",
        parent_name_on_form: "",
        parent_cell_on_form: "",
        parent_email_on_form: "",
        student_reference_id: "",
      });
    } else if (state.type === "error") {
      toast.error(state.message);

      // Set server-side validation errors
      if (state.errors) {
        Object.entries(state.errors).forEach(([field, messages]) => {
          form.setError(field as keyof AddStudentFormValues, {
            type: "server",
            message: messages[0],
          });
        });
      }
    }
  }, [state, form, defaultClassId]);

  const onSubmit = async (data: AddStudentFormValues) => {
    // Create FormData for server action
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Call server action
    formAction(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Student
        </CardTitle>
        <CardDescription>
          Enter the student and parent details to add them to the class.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem
                          key={classItem.class_id}
                          value={classItem.class_id.toString()}
                        >
                          {classItem.class_name} - {classItem.teacher_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the class this student belongs to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="student_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter student's full name"
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
              name="student_reference_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Reference ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Optional reference ID"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional student ID or reference number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Parent/Guardian Information
              </h3>

              <FormField
                control={form.control}
                name="parent_name_on_form"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter parent/guardian full name"
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
                  name="parent_email_on_form"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="parent@example.com"
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
                  name="parent_cell_on_form"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Cell Phone *</FormLabel>
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
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Student...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddStudent;
