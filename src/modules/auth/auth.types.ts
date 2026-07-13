

import { z } from "zod";
import { reigisterSchema } from "./auth.validation.js";


export type RegisterInput = z.infer<
  typeof reigisterSchema
>;