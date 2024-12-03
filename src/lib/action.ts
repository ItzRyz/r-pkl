"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { addUserSchema, signInSchema } from "./zod";
import { useToast } from "@/hooks/use-toast";

export async function authenticate(prevState: unknown, formData: FormData) {
  const validatedFields = signInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/",
      redirect: true,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Failed to sign in" };
        default:
          return { message: "Invalid username or password" };
      }
    }
    throw error;
  }
}
