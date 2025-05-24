"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { uploadPhotoAction } from "@/utils/actions/photoActions";
import {
  uploadPhotoSchema,
  type UploadPhotoFormValues,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Camera,
  School,
  GraduationCap,
  Users,
  Calendar,
} from "lucide-react";
import { generateRandomString } from "@/utils/utils";

type ComponentProps = {
  schools: Database["public"]["Tables"]["schools"]["Row"][];
  classes: Database["public"]["Tables"]["classes"]["Row"][];
  students: Database["public"]["Tables"]["students"]["Row"][];
  events: Database["public"]["Tables"]["photo_shoot_events"]["Row"][];
};

const UploadPhotoForm = ({
  schools,
  classes,
  students,
  events,
}: ComponentProps) => {
  const [selectedSchool, setSelectedSchool] = React.useState<
    Database["public"]["Tables"]["schools"]["Row"] | null
  >(null);
  const [selectedClass, setSelectedClass] = React.useState<
    Database["public"]["Tables"]["classes"]["Row"] | null
  >(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // React Hook Form setup
  const form = useForm<UploadPhotoFormValues>({
    resolver: zodResolver(uploadPhotoSchema),
    defaultValues: {
      is_class_photo: false, // Provide default boolean value
      is_public_in_gallery: false, // Provide default boolean value
      event_id: undefined,
      image_url: undefined,
      thumbnail_url: undefined,
      photo_reference_code: "",
      student_id: undefined,
      class_id: undefined,
    },
  });

  // Filter classes by selected school
  const filteredClasses = React.useMemo(() => {
    if (!selectedSchool) return [];
    return classes.filter((c) => c.school_id === selectedSchool.school_id);
  }, [selectedSchool, classes]);

  // Filter students by selected class
  const filteredStudents = React.useMemo(() => {
    if (!selectedClass) return [];
    return students.filter((s) => s.class_id === selectedClass.class_id);
  }, [selectedClass, students]);

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
  const onSubmit = async (data: UploadPhotoFormValues) => {
    if (!data.image_url) {
      toast.error("Please upload an image first");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const result = await uploadPhotoAction(null, formData);

      if (result?.success) {
        toast.success("Photo uploaded successfully!");
        form.reset();
        setSelectedSchool(null);
        setSelectedClass(null);
        // Reset dropzone files
        dropzoneProps.acceptedFiles = [];
      } else if (result?.error) {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else {
          // Handle field errors
          Object.entries(result.error).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                toast.error(`${field}: ${message}`);
              });
            }
          });
        }
      }
    } catch (error) {
      toast.error("Failed to upload photo");
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle school selection
  const handleSchoolChange = (schoolId: string) => {
    const school = schools.find((s) => s.school_id.toString() === schoolId);
    setSelectedSchool(school || null);
    setSelectedClass(null);
    form.setValue("class_id", 0);
    form.setValue("student_id", 0);
    form.setValue("event_id", 0);
  };

  // Handle class selection
  const handleClassChange = (classId: string) => {
    const classData = filteredClasses.find(
      (c) => c.class_id.toString() === classId
    );
    setSelectedClass(classData || null);
    form.setValue("class_id", parseInt(classId));
    form.setValue("student_id", 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Photo
          </CardTitle>
          <CardDescription>
            Upload a new photo to the school gallery. Select the school, class,
            and student, then upload the image.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        Photo Shoot Event
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        disabled={!selectedSchool}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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

              {/* Class and Student Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <FormField
                  control={form.control}
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Select Student
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        disabled={!selectedClass}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredStudents.map((student) => (
                            <SelectItem
                              key={student.student_id}
                              value={student.student_id.toString()}
                            >
                              {student.student_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Photo Reference Code */}
              <FormField
                control={form.control}
                name="photo_reference_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo Reference Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-x-3">
                        <Input
                          placeholder="Enter photo reference code"
                          {...field}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const code = generateRandomString();
                            form.setValue("photo_reference_code", code);
                          }}
                        >
                          Generate Code
                        </Button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Photo Options */}
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="is_class_photo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>This is a class photo</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Check if this photo includes the entire class
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_public_in_gallery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Make public in gallery</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Allow this photo to be visible in public galleries
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!form.watch("image_url") || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Uploading..." : "Upload Photo"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPhotoForm;
