import type {
  Request,
  Response,
} from "express";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {

  console.log(req.body);

  res.status(201).json({
    success: true,
    message: "Controller Working",
  });

};