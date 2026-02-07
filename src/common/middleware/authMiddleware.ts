// src/common/middleware/authMiddleware.ts
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserStore } from "../../modules/auth/auth.store";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  console.log(">>> AUTH HEADER:", header);

  if (!header || !header.startsWith("Bearer ")) {
    console.log(">>> AUTH HEADER missing or malformed");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    console.log(">>> No token after Bearer");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // quick decode for debugging (does NOT verify)
  try {
    console.log(">>> TOKEN (prefix):", token.substring(0, 40) + "...");
  } catch (e) {
    /* ignore */
  }

  const secret: jwt.Secret = (process.env.JWT_SECRET || "changeme")
    .toString()
    .trim();
  console.log(
    ">>> VERIFY SECRET (masked):",
    secret
      ? `${String(secret).slice(0, 4)}...${String(secret).slice(-4)}`
      : "(empty)"
  );

  try {
    const decoded = jwt.decode(token);
    console.log(">>> DECODED (no-verify):", decoded);

    // verify (this throws if invalid)
    const payload = jwt.verify(token, secret) as any;
    console.log(">>> VERIFIED PAYLOAD:", {
      sub: payload.sub,
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    // support both `sub` (preferred) and `id` (if any)
    const userId = String(payload.sub || payload.id);
    if (!userId) {
      console.log(">>> No user id in token payload");
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await UserStore.findById(userId);
    if (!user) {
      console.log(">>> User not found for id:", userId);
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    (req as any).user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyStatus: user.companyStatus,
    };

    next();
  } catch (err: any) {
    console.error(
      ">>> JWT VERIFY ERROR:",
      err && err.message ? err.message : err
    );
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
