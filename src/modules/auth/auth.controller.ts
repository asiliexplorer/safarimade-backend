import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // parse pagination params
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 50);
      const skip = (page - 1) * limit;

      // Users page is admin-only
      const filters: any = { role: "admin" };
      if (req.query.email) filters.email = String(req.query.email);
      if (req.query.name) filters.name = { $regex: String(req.query.name), $options: "i" };

      const result = await AuthService.listUsers(filters, { limit, skip });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await AuthService.getUserById(userId);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const user = await AuthService.register(email, password, name);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log("[AuthController][Backend] Login attempt:", email, "with password length:", password);
      const result = await AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response) {
    res.json({ success: true, data: (req as any).user });
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const updates = req.body;
      const requestingUser = (req as any).user;

      const updated = await AuthService.updateUser(userId, updates, requestingUser);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const requestingUser = (req as any).user;

      const deleted = await AuthService.deleteUser(userId, requestingUser);
      res.json({ success: true, data: deleted });
    } catch (err) {
      next(err);
    }
  }
}
