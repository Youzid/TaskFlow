import { z } from "zod";
import { List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateListColorSchema } from "./schema";


export type InputType = z.infer<typeof UpdateListColorSchema>;
export type ReturnType = ActionState<InputType, List>;
