import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // parse pagination params
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 50);
      const skip = (page - 1) * limit;

      // Optional filtering by role/email/name
      const filters: any = {};
      if (req.query.role) filters.role = req.query.role;
      if (req.query.email) filters.email = String(req.query.email);
      if (req.query.name) filters.name = { $regex: String(req.query.name), $options: "i" };

      const result = await AuthService.listUsers(filters, { limit, skip });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status ? String(req.query.status) : undefined;
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 50);
      const skip = (page - 1) * limit;

      const result = await AuthService.listCompanies(status, { limit, skip });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;
      const user = await AuthService.register(email, password, name, role);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response) {
    res.json({ success: true, data: (req as any).user });
  }

  static async setCompanyStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.params.id;
      const { status } = req.body;
      const updated = await AuthService.setCompanyStatus(companyId, status);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}
