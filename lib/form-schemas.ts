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

const editClientAccountSchema = clientAccountUpdateSchema.extend({
  client_id: z.coerce.number({
    required_error: "Client ID is required",
    invalid_type_error: "Client ID must be a number",
  }),
});

export type ClientAccountUpdateFormValues = z.infer<
  typeof clientAccountUpdateSchema
>;
export type EditClientAccountFormValues = z.infer<
  typeof editClientAccountSchema
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

// Schema for class/event photos (no student selection, automatically public)
export const uploadClassEventPhotoSchema = z.object({
  event_id: z.coerce.number().optional(),
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
  photo_title: z.string().optional(),
  photo_description: z.string().optional(),
});

export const editPhotoSchema = uploadPhotoSchema.extend({
  photo_id: z.coerce.number({
    required_error: "Photo ID is required",
    invalid_type_error: "Photo ID must be a number",
  }),
});

export type UploadPhotoFormValues = z.infer<typeof uploadPhotoSchema>;
export type UploadClassEventPhotoFormValues = z.infer<
  typeof uploadClassEventPhotoSchema
>;

export const createSchoolSchema = z.object({
  school_name: z.string({ required_error: "School name is required" }),
  contact_person: z.string({ required_error: "Contact person is required" }),
  contact_email: z.string({ required_error: "Contact email is required" }),
  contact_phone: z.string({ required_error: "Contact phone is required" }),
  address: z.string({ required_error: "Address is required" }),
});

export const editSchoolSchema = createSchoolSchema.extend({
  school_id: z.coerce.number({
    required_error: "School ID is required",
    invalid_type_error: "School ID must be a number",
  }),
});

export type CreateSchoolFormValues = z.infer<typeof createSchoolSchema>;
export type EditSchoolFormValues = z.infer<typeof editSchoolSchema>;

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

export const editStudentSchema = addStudentSchema.extend({
  student_id: z.coerce.number({
    required_error: "Student ID is required",
    invalid_type_error: "Student ID must be a number",
  }),
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;
export type EditStudentFormValues = z.infer<typeof editStudentSchema>;

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

export const editClassSchema = addClassSchema.extend({
  class_id: z.coerce.number({
    required_error: "Class ID is required",
    invalid_type_error: "Class ID must be a number",
  }),
});

export type AddClassFormValues = z.infer<typeof addClassSchema>;
export type EditClassFormValues = z.infer<typeof editClassSchema>;

export const addEventSchema = z.object({
  school_id: z.coerce.number({
    required_error: "School ID is required",
    invalid_type_error: "School ID must be a number",
  }),
  event_name: z.string({
    required_error: "Event name is required",
    invalid_type_error: "Event name must be a string",
  }),
  shoot_date: z.date().optional(),
  order_deadline: z.date().optional(),
  photo_gallery_live_until: z.date().optional(),
  notes: z.string().optional(),
});

export const editEventSchema = addEventSchema.extend({
  event_id: z.coerce.number({
    required_error: "Event ID is required",
    invalid_type_error: "Event ID must be a number",
  }),
});

export type AddEventFormValues = z.infer<typeof addEventSchema>;
export type EditEventFormValues = z.infer<typeof editEventSchema>;
