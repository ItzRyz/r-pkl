"use server";

import { addUserSchema, editUserSchema } from "@/lib/zod/user";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

type userResponse = {
  error?: z.ZodIssue[];
  message?: string;
  status?: number;
};

const addUser = async (
  prevState: unknown,
  formData: FormData
): Promise<userResponse> => {
  const validatedFields = addUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues,
    };
  }

  const { username, email, name, groupid, password } = validatedFields.data;

  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        name,
        groupid: Number.parseInt(groupid),
        password,
      }),
    });

    const response = await request.json();
    return { message: response.message, status: request.status };
  } catch (error: any) {
    return { message: error.message };
  }
};

const editUser = async (
  prevState: unknown,
  formData: FormData
): Promise<userResponse> => {
  const validatedFields = editUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues,
    };
  }

  const { id, username, email, name, groupid, password } = validatedFields.data;

  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        username,
        email,
        name,
        groupid: null,
        password,
      }),
    });

    const response = await request.json();
    return { message: response.message, status: request.status };
  } catch (error: any) {
    return { message: error.message };
  }
};

export { addUser, editUser };
