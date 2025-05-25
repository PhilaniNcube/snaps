"use client";

import React, { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { uploadClassEventPhotoAction } from "@/utils/actions/photoActions";
import {
  uploadClassEventPhotoSchema,
  type UploadClassEventPhotoFormValues,
} from "@/lib/form-schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Camera,
  School,
  GraduationCap,
  Calendar,
  Globe,
  Info,
} from "lucide-react";
import { generateRandomString } from "@/utils/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ComponentProps = {
  schools: Database["public"]["Tables"]["schools"]["Row"][];
  classes: Database["public"]["Tables"]["classes"]["Row"][];
  events: Database["public"]["Tables"]["photo_shoot_events"]["Row"][];
  onSuccess?: () => void;
};

const UploadClassEventPhotoForm = ({
  schools,
  classes,
  events,
  onSuccess,
}: ComponentProps) => {
  const [selectedSchool, setSelectedSchool] = React.useState<
    Database["public"]["Tables"]["schools"]["Row"] | null
  >(null);
  const [selectedClass, setSelectedClass] = React.useState<
    Database["public"]["Tables"]["classes"]["Row"] | null
  >(null);

  const [state, formAction, isPending] = useActionState(
    uploadClassEventPhotoAction,
    null
  );

  // React Hook Form setup
  const form = useForm<UploadClassEventPhotoFormValues>({
    resolver: zodResolver(uploadClassEventPhotoSchema),
    defaultValues: {
      event_id: undefined,
      image_url: undefined,
      thumbnail_url: undefined,
      photo_reference_code: "",
      class_id: undefined,
      photo_title: "",
      photo_description: "",
    },
  });

  // Filter classes by selected school
  const filteredClasses = React.useMemo(() => {
    if (!selectedSchool) return [];
    return classes.filter((c) => c.school_id === selectedSchool.school_id);
  }, [selectedSchool, classes]);

  // Filter events by selected school
  const filteredEvents = React.useMemo(() => {
    if (!selectedSchool) return [];
    return events.filter((e) => e.school_id === selectedSchool.school_id);
  }, [selectedSchool, events]);

  // Dropzone setup
  const dropzoneProps = useSupabaseUpload({
    bucketName: "school-photos",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10, // 10MB
  });

  // Handle successful uploads
  React.useEffect(() => {
    if (dropzoneProps.successes.length > 0) {
      const uploadedUrl = dropzoneProps.successes[0];
      form.setValue("image_url", uploadedUrl);
      form.setValue("thumbnail_url", uploadedUrl);
    }
  }, [dropzoneProps.successes, form]);

  // Handle form submission
  const onSubmit = async (data: UploadClassEventPhotoFormValues) => {
    if (!data.image_url) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      startTransition(() => {
        formAction(formData);
      });

      if (state?.success) {
        toast.success("Class/event photo uploaded successfully!");
        form.reset();
        setSelectedSchool(null);
        setSelectedClass(null);
        // Reset dropzone files
        dropzoneProps.setFiles([]);
        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      } else if (state?.error) {
        if (typeof state.error === "string") {
          toast.error(state.error);
        } else {
          // Handle field errors
          Object.entries(state.error).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                toast.error(`${field}: ${message}`);
              });
            }
          });
        }
      }
    } catch (error) {
      toast.error("Failed to upload class/event photo");
      console.error("Upload error:", error);
    }
  };

  // Handle school selection
  const handleSchoolChange = (schoolId: string) => {
    const school = schools.find((s) => s.school_id.toString() === schoolId);
    setSelectedSchool(school || null);
    setSelectedClass(null);
    form.setValue("class_id", 0);
    form.setValue("event_id", 0);
  };

  // Handle class selection
  const handleClassChange = (classId: string) => {
    const classData = filteredClasses.find(
      (c) => c.class_id.toString() === classId
    );
    setSelectedClass(classData || null);
    form.setValue("class_id", parseInt(classId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Class/Event Photo
          </CardTitle>
          <CardDescription>
            Upload photos for classes or events. These photos will be
            automatically public and available in galleries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Class and event photos are automatically
              made public and visible in galleries. These are meant for group
              photos, class activities, and event documentation.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* School Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Select School
                  </label>
                  <Select onValueChange={handleSchoolChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem
                          key={school.school_id}
                          value={school.school_id.toString()}
                        >
                          {school.school_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Event Selection */}
                <FormField
                  control={form.control}
                  name="event_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Photo Shoot Event (Optional)
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        disabled={!selectedSchool}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No specific event</SelectItem>
                          {filteredEvents.map((event) => (
                            <SelectItem
                              key={event.event_id}
                              value={event.event_id.toString()}
                            >
                              {event.event_name}{" "}
                              {event.shoot_date &&
                                `(${new Date(event.shoot_date).toLocaleDateString()})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Class Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Select Class
                </label>
                <Select
                  onValueChange={handleClassChange}
                  disabled={!selectedSchool}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClasses.map((classItem) => (
                      <SelectItem
                        key={classItem.class_id}
                        value={classItem.class_id.toString()}
                      >
                        {classItem.class_name}{" "}
                        {classItem.teacher_name &&
                          `(${classItem.teacher_name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Photo Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="photo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo Title (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Class of 2024 Group Photo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo_reference_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo Reference Code</FormLabel>
                      <FormControl>
                        <div className="flex gap-x-2">
                          <Input
                            placeholder="Enter photo reference code"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const code = generateRandomString();
                              form.setValue("photo_reference_code", code);
                            }}
                          >
                            Generate
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="photo_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the photo, event, or occasion..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </label>
                <div className="w-full max-w-md">
                  <Dropzone {...dropzoneProps}>
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </div>
                {form.watch("image_url") && (
                  <p className="text-sm text-green-600">
                    ✓ Image uploaded successfully
                  </p>
                )}
              </div>

              {/* Auto-settings Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <Globe className="h-4 w-4" />
                  Automatic Settings
                </div>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>✓ Photo will be marked as a class photo</li>
                  <li>✓ Photo will be public in gallery</li>
                  <li>✓ No individual student association</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  !form.watch("image_url") || !selectedClass || isPending
                }
                className="w-full"
              >
                {isPending ? "Uploading..." : "Upload Class/Event Photo"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadClassEventPhotoForm;
