import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { ZodType } from "zod";

const validateRequest =
  (schema: ZodType) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[1] as string;
        formattedErrors[field] = issue.message;
      });

      res.status(400).json({
        success: false,
        message: "Validation Failed",
        showToast: true,
        errors: formattedErrors,
      });

      return;
    }

    console.log("Validation Passed");
    console.log(result.data);

    next();
  };

export default validateRequest;