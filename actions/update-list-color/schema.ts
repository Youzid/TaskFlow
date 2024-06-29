import { z } from "zod";
const colorPattern = /^#([0-9A-F]{3}){1,2}$/i;

export const UpdateListColorSchema = z.object({
  id: z.string(),
  color: z.string().regex(colorPattern, {
    message: "Invalid color format",
  }),
  boardId: z.string(),
});
