import { object, string } from "zod";

const addGroupSchema = object({
  groupnm: string().min(1, "Group name is required"),
});

const editGroupSchema = object({
  id: string().min(1, "Id is required"),
  groupnm: string().min(1, "Group name is required"),
});

export { addGroupSchema, editGroupSchema };
