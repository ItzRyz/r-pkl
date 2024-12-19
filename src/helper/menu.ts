"use server";

import { addMenuSchema, editMenuSchema } from "@/lib/zod/menu";
import { z } from "zod";

type menuResponse = {
  error?: z.ZodIssue[];
  message?: string;
  status?: number;
};

const addMenu = async (
  prevState: unknown,
  formData: FormData
): Promise<menuResponse> => {
  const validatedFields = addMenuSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues,
    };
  }

  const { menunm, seq, icon, masterid, link } = validatedFields.data;

  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menunm,
        seq,
        icon,
        link,
        masterid,
        isactive: true,
      }),
    });

    const res = await req.json();
    return { message: res.message, status: req.status };
  } catch (err: any) {
    return { message: err.message };
  }
};

const editMenu = async (
  prevState: unknown,
  formData: FormData
): Promise<menuResponse> => {
  const validateFields = editMenuSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return {
      error: validateFields.error.issues,
    };
  }

  const { id, menunm, seq, icon, masterid, link } = validateFields.data;

  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
      method: "PUT",
      headers: {
        "Content-Type": "appliication/json",
      },
      body: JSON.stringify({
        id,
        menunm,
        link,
        seq,
        icon,
        masterid,
        isactive: true,
      }),
    });

    const res = await req.json();
    return { message: res.message, status: req.status };
  } catch (err: any) {
    return { message: err.message };
  }
};

export { addMenu, editMenu };
