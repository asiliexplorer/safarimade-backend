import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
}).min(1);

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

export function updateUserValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = updateUserSchema.validate(req.body);
  if (error)
    return res.status(400).json({ success: false, error: error.message });
  next();
}
