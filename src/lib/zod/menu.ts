import { number, object, string } from "zod";

const addMenuSchema = object({
  menunm: string().min(1, "Menu name is required"),
  link: string().min(1, "Menu link is required"),
  icon: string(),
  seq: number(),
  masterid: number(),
});

const editMenuSchema = object({
  id: string().min(1, "Id is required"),
  menunm: string().min(1, "Menu name is required"),
  link: string().min(1, "Menu link is required"),
  icon: string(),
  seq: number(),
  masterid: number(),
});

export { addMenuSchema, editMenuSchema };
