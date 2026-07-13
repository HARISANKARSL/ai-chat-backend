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
    _res: Response,
    next: NextFunction
  ): void => {

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

   if (!result.success) {
  _res.status(400).json({
    success: false,
    errors: result.error.issues,
  });

  return;
}


    console.log("Validation Passed");
    console.log(result);

    next();
  };

export default validateRequest;