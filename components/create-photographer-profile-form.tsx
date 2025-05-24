"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import {
  CreatePhotographerProfileFormValues,
  createPhotographerProfileSchema,
} from "@/lib/form-schemas";
import {
  createPhotographerProfileAction,
  CreatePhotographerProfileActionState,
} from "@/utils/actions/photographersActions";
import { startTransition, useActionState, useEffect } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";

const initialState: CreatePhotographerProfileActionState = {
  message: "",
  type: "idle",
  errors: null,
  data: null,
};

export function CreatePhotographerProfileForm() {
  const [state, formAction, isPending] = useActionState(
    createPhotographerProfileAction,
    initialState
  );

  const form = useForm<CreatePhotographerProfileFormValues>({
    resolver: zodResolver(createPhotographerProfileSchema),
    defaultValues: {
      company_name: "",
      bio: "",
      profile_picture_url: null, // Changed to null for better schema compatibility
    },
  });

  // Callback to handle successful file upload from the hook
  const handleUploadComplete = (url: string | null, error?: Error) => {
    if (url) {
      form.setValue("profile_picture_url", url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Profile picture uploaded successfully!");
    }
    if (error) {
      toast.error("Upload Failed", { description: error.message });
    }
  };

  const uploadHookProps = useSupabaseUpload({
    bucketName: "profile-pictures", // Replace with your actual bucket name
    // folderName can be part of bucketName if needed, or handled by the hook internally
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    upsert: true,
  });

  const onUpload = uploadHookProps.onUpload;

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      form.reset();
      uploadHookProps.setFiles([]); // Clear files from dropzone
      // Potentially clear the displayed URL if you store it in a separate state for display
    } else if (state.type === "error") {
      toast.error(state.message, {
        description: state.errors
          ? Object.values(state.errors).flat().join(", ")
          : undefined,
      });
    }
  }, [state, form, uploadHookProps.setFiles]);

  return (
    <Form {...form}>
      <form
        action={formAction}
        onSubmit={form.handleSubmit(() => {
          const formData = new FormData();
          const values = form.getValues();
          formData.append("company_name", values.company_name);
          if (values.bio) formData.append("bio", values.bio);
          // get the file url from the upload hook successes
          const filePath = uploadHookProps.successes[0];
          const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET}${filePath}`;

          startTransition(() => {
            formAction(formData);
          });
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Company LLC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about your company"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile_picture_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div>
                  <Dropzone {...uploadHookProps} className="mt-2">
                    {uploadHookProps.files?.length > 0 ||
                    uploadHookProps.isDragActive ? (
                      <DropzoneContent />
                    ) : field.value ? (
                      // Display current image and remove button if URL exists and no new files are being dragged/selected
                      <div className="flex flex-col items-center gap-2 p-4 border border-dashed rounded-md">
                        <img
                          src={field.value}
                          alt="Current profile picture"
                          className="max-h-32 rounded"
                        />
                        <p className="text-sm text-muted-foreground">
                          Current picture. Upload a new one to replace it.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            form.setValue("profile_picture_url", null, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            uploadHookProps.setFiles([]);
                            // Note: This doesn't delete from Supabase storage, only clears the URL from the form.
                            toast.info("Profile picture removed from form.");
                          }}
                        >
                          Remove Picture
                        </Button>
                      </div>
                    ) : (
                      <DropzoneEmptyState />
                    )}
                  </Dropzone>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {state.type === "error" && state.message && !state.errors && (
          <p className="text-sm font-medium text-destructive">
            {state.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={
            form.formState.isSubmitting || uploadHookProps.loading || isPending
          }
        >
          {form.formState.isSubmitting
            ? "Creating Profile..."
            : uploadHookProps.loading
              ? "Uploading Picture..."
              : "Create Photographer Profile"}
        </Button>
      </form>
    </Form>
  );
}
