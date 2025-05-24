"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Camera, FileText, Loader2 } from "lucide-react";
import { addEventAction } from "@/utils/actions/eventActions";
import { addEventSchema, type AddEventFormValues } from "@/lib/form-schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AddEventActionState = {
  success: boolean;
  message: string;
  errors?: any;
  data?: Database["public"]["Tables"]["photo_shoot_events"]["Row"] | null;
  error?: string;
  values?: any;
};

type AddEventProps = {
  schoolId: number;
  onSuccess?: (
    event: Database["public"]["Tables"]["photo_shoot_events"]["Row"]
  ) => void;
};

const AddEvent: React.FC<AddEventProps> = ({ schoolId, onSuccess }) => {
  // Server action state
  const [state, formAction, isPending] = useActionState(addEventAction, {
    success: false,
    message: "",
    errors: null,
    data: null,
  } as AddEventActionState);

  // React Hook Form setup
  const form = useForm<AddEventFormValues>({
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      school_id: schoolId,
      event_name: "",
      shoot_date: undefined,
      order_deadline: undefined,
      photo_gallery_live_until: undefined,
      notes: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: AddEventFormValues) => {
    // Form will be submitted via the action attribute on the form element
    // No need to manually call formAction here
  };

  // Handle state changes from server action
  React.useEffect(() => {
    if (state.success && state.data) {
      toast.success(state.message || "Event created successfully!");

      // Reset form
      form.reset({
        school_id: schoolId,
        event_name: "",
        shoot_date: undefined,
        order_deadline: undefined,
        photo_gallery_live_until: undefined,
        notes: "",
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(state.data);
      }
    } else if (state.errors) {
      // Handle field-specific errors
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        }
      });
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, form, schoolId, onSuccess]);

  // Handle date input helpers
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    return new Date(dateString);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Add Photo Shoot Event
        </CardTitle>
        <CardDescription>
          Create a new photo shoot event for this school. Set dates for the
          shoot, order deadline, and gallery availability.
        </CardDescription>
      </CardHeader>{" "}
      <CardContent>
        <Form {...form}>
          {" "}
          <form action={formAction} className="space-y-6">
            {/* Hidden fields for server action */}
            <Input type="hidden" name="school_id" value={schoolId} />
            <Input
              type="hidden"
              name="event_name"
              value={form.watch("event_name")}
            />
            <Input
              type="hidden"
              name="shoot_date"
              value={form.watch("shoot_date")?.toISOString() || ""}
            />
            <Input
              type="hidden"
              name="order_deadline"
              value={form.watch("order_deadline")?.toISOString() || ""}
            />
            <Input
              type="hidden"
              name="photo_gallery_live_until"
              value={
                form.watch("photo_gallery_live_until")?.toISOString() || ""
              }
            />
            <Input
              type="hidden"
              name="notes"
              value={form.watch("notes") || ""}
            />

            {/* Event Name */}
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Event Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Spring 2025 School Photos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shoot Date */}
              <FormField
                control={form.control}
                name="shoot_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Shoot Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={formatDateForInput(field.value)}
                        onChange={(e) =>
                          field.onChange(parseDateFromInput(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Deadline */}
              <FormField
                control={form.control}
                name="order_deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Order Deadline
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={formatDateForInput(field.value)}
                        onChange={(e) =>
                          field.onChange(parseDateFromInput(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gallery Live Until */}
              <FormField
                control={form.control}
                name="photo_gallery_live_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Gallery Live Until
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={formatDateForInput(field.value)}
                        onChange={(e) =>
                          field.onChange(parseDateFromInput(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notes (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this photo shoot event..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full relative"
            >
              {isPending ? "Creating Event..." : "Create Event"}
              {isPending && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddEvent;
