import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional(),
  role: Joi.string().valid("admin", "customer", "company").optional(), // only if you allow role in body
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export function registerValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = registerSchema.validate(req.body);
  if (error)
    return res.status(400).json({ success: false, error: error.message });
  next();
}

export function loginValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = loginSchema.validate(req.body);
  if (error)
    return res.status(400).json({ success: false, error: error.message });
  next();
}
