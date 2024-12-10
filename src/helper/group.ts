"use server";

import { addGroupSchema, editGroupSchema } from "@/lib/zod/group";
import { z } from "zod";

type groupResponse = {
  error?: z.ZodIssue[];
  message?: string;
  status?: number;
};

const addGroup = async (
  prevState: unknown,
  formData: FormData
): Promise<groupResponse> => {
  const validatedFields = addGroupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues,
    };
  }

  const { groupnm } = validatedFields.data;

  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupnm,
      }),
    });

    const res = await req.json();
    return { message: res.message, status: req.status };
  } catch (err: any) {
    return { message: err.message };
  }
};

const editGroup = async (
  prevState: unknown,
  formData: FormData
): Promise<groupResponse> => {
  const validateFields = editGroupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return {
      error: validateFields.error.issues,
    };
  }

  const { id, groupnm } = validateFields.data;

  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group`, {
      method: "PUT",
      headers: {
        "Content-Type": "appliication/json",
      },
      body: JSON.stringify({
        id,
        groupnm,
      }),
    });

    const res = await req.json();
    return { message: res.message, status: req.status };
  } catch (err: any) {
    return { message: err.message };
  }
};

export { addGroup, editGroup };
