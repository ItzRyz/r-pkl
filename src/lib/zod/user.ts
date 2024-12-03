import { object, string } from "zod";

const addUserSchema = object({
  username: string()
    .min(1, "Username is required")
    .min(4, "Username must be more than 4 characters")
    .max(16, "Username must be less than 16 characters"),
  name: string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  email: string()
    .min(1, "Email is required")
    .email("Email is not valid format."),
  groupid: string().min(1, "Group is required"),
  password: string()
    .min(1, "Password is required")
    .min(1, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

const editUserSchema = object({
  username: string()
    .min(1, "Username is required")
    .min(4, "Username must be more than 4 characters")
    .max(16, "Username must be less than 16 characters"),
  name: string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  email: string()
    .min(1, "Email is required")
    .email("Email is not valid format."),
  groupid: string().min(1, "Group is required"),
  password: string()
    .min(1, "Password is required")
    .min(1, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export { addUserSchema, editUserSchema };
