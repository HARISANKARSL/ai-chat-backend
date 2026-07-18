import { createSecurityLog } from "./security.repository.js";
import type { CreateSecurityLogInput } from "./security.types.js";

export const logSecurityEvent = async (
  input: CreateSecurityLogInput
): Promise<void> => {
  await createSecurityLog(input);
};