import { z } from "zod";

// Profile Update Form Schema
export const profileUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name is required" })
    .nullable(),
  last_name: z.string().min(1, { message: "Last name is required" }).nullable(),
  email_address: z
    .string()
    .email({ message: "Invalid email address" })
    .nullable(),
  phone_number: z.string().nullable(), // Add more specific phone validation if needed
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

// Client Account Update Form Schema

export const clientAccountUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name is required" })
    .nullable(),
  last_name: z.string().min(1, { message: "Last name is required" }).nullable(),
  email: z.string().email({ message: "Invalid email address" }).nullable(),
});
export type ClientAccountUpdateFormValues = z.infer<
  typeof clientAccountUpdateSchema
>;

export const uploadPhotoSchema = z.object({
  event_id: z.coerce.number().optional(),
  student_id: z.coerce.number({
    required_error: "Student ID is required",
    invalid_type_error: "Student ID must be a number",
  }),
  class_id: z.coerce.number({
    required_error: "Class ID is required",
    invalid_type_error: "Class ID must be a number",
  }),
  photo_reference_code: z
    .string({
      required_error: "Photo reference code is required",
      invalid_type_error: "Photo reference code must be a string",
    })
    .min(8, {
      message: "Photo reference code cannot be empty",
    })
    .max(9, {
      message: "Photo reference code must be 8 or 9 characters long",
    }),
  image_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  is_class_photo: z.boolean(),
  is_public_in_gallery: z.boolean(),
});

export type UploadPhotoFormValues = z.infer<typeof uploadPhotoSchema>;

export const createSchoolSchema = z.object({
  school_name: z.string({ required_error: "School name is required" }),
  contact_person: z.string({ required_error: "Contact person is required" }),
  contact_email: z.string({ required_error: "Contact email is required" }),
  contact_phone: z.string({ required_error: "Contact phone is required" }),
  address: z.string({ required_error: "Address is required" }),
});

export type CreateSchoolFormValues = z.infer<typeof createSchoolSchema>;

export const addStudentSchema = z.object({
  class_id: z.coerce.number({
    required_error: "Class ID is required",
    invalid_type_error: "Class ID must be a number",
  }),
  student_name: z.string({
    required_error: "Student name is required",
    invalid_type_error: "Student name must be a string",
  }),
  parent_name_on_form: z.string({
    required_error: "Parent name is required",
    invalid_type_error: "Parent name must be a string",
  }),
  parent_cell_on_form: z.string({
    required_error: "Parent cell is required",
    invalid_type_error: "Parent cell must be a string",
  }),
  parent_email_on_form: z.string({
    required_error: "Parent email is required",
    invalid_type_error: "Parent email must be a string",
  }),
  student_reference_id: z.string().optional(),
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;

export const addClassSchema = z.object({
  school_id: z.coerce.number({
    required_error: "School ID is required",
    invalid_type_error: "School ID must be a number",
  }),
  class_name: z.string({
    required_error: "Class name is required",
    invalid_type_error: "Class name must be a string",
  }),
  event_id: z.coerce.number().optional(),
  teacher_name: z.string({
    required_error: "Teacher name is required",
    invalid_type_error: "Teacher name must be a string",
  }),
  academic_year: z.coerce.number({
    required_error: "Academic year is required",
    invalid_type_error: "Academic year must be a string",
  }),
});

export type AddClassFormValues = z.infer<typeof addClassSchema>;
