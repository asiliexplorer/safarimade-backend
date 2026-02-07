// src/common/middleware/roleMiddleware.ts
import { NextFunction, Request, Response } from "express";

export function roleMiddleware(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // case-insensitive compare and support multiple roles if required
    if (String(user.role).toLowerCase() !== requiredRole.toLowerCase()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    next();
  };
}
