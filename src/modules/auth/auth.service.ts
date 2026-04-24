// src/modules/auth/auth.service.ts
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserStore } from "./auth.store";
import { getJwtSecret } from "../../common/jwt"; // ensure this file exists

const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

export class AuthService {
  static async register(
    email: string,
    password: string,
    name?: string,
    role?: string
  ) {
    const existing = await UserStore.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await UserStore.create({
      email,
      passwordHash,
      name,
      role,
      companyStatus: role === "company" ? "pending" : undefined,
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyStatus: user.companyStatus,
    };
  }

  static async login(email: string, password: string) {
    const user = await UserStore.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    if (user.role === "company" && user.companyStatus === "rejected") {
      throw new Error("Your company account was rejected by admin");
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error("Invalid credentials");

    // get secret at runtime
    const secret = getJwtSecret();

    // Make sure secret exists; this guarantees correct typing for jwt.sign overload
    if (!secret) {
      throw new Error("JWT secret is not configured (getJwtSecret returned empty)");
    }

    // Cast to jwt.Secret for clarity (may be unused by TS if we cast sign to any below)
    const typedSecret: jwt.Secret = secret as unknown as jwt.Secret;

    // --- IMPORTANT: use a local cast to `any` for jwt.sign so TS doesn't try to match
    // the overloaded signatures that are causing the compiler error in your environment.
    const token = (jwt.sign as any)(
      {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        companyStatus: user.companyStatus,
      },
      typedSecret,
      { expiresIn: JWT_EXPIRES_IN }
    ) as string;

    // Masked logging for debug (safe): *DO NOT* enable full token/secret in production logs
    try {
      console.log(">>> ISSUED TOKEN (prefix):", (token ?? "").substring(0, 40) + "...");
      console.log(
        ">>> SIGN SECRET (masked):",
        secret
          ? `${String(secret).slice(0, 4)}...${String(secret).slice(-4)}`
          : "(empty)"
      );
    } catch (e) {
      /* ignore logging error */
    }

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyStatus: user.companyStatus,
      },
    };
  }

  static async listUsers(
    filters: any = {},
    options: { limit?: number; skip?: number } = {}
  ) {
    const projection = { passwordHash: 0, __v: 0 };
    const users = await UserStore.findMany(filters, projection, options);
    const total = await UserStore.count(filters);

    return {
      items: users,
      total,
      limit: options.limit || 0,
      skip: options.skip || 0,
    };
  }

  static async listCompanies(
    status?: string,
    options: { limit?: number; skip?: number } = {}
  ) {
    const filters: any = { role: "company" };
    if (status) filters.companyStatus = status;

    const projection = { passwordHash: 0, __v: 0 };
    const companies = await UserStore.findMany(filters, projection, options);
    const total = await UserStore.count(filters);

    return {
      items: companies,
      total,
      limit: options.limit || 0,
      skip: options.skip || 0,
    };
  }

  static async getUserById(userId: string) {
    const user = await UserStore.findById(userId);
    if (!user) throw new Error("User not found");
    return {
      _id: user._id,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyStatus: user.companyStatus,
      createdAt: user.createdAt,
    };
  }

  static async setCompanyStatus(companyId: string, status: string) {
    const updated = await UserStore.update(companyId, {
      companyStatus: status,
    });
    if (!updated) throw new Error("Company not found");
    return updated;
  }

  static async updateUser(
    userId: string,
    updates: { name?: string; email?: string; password?: string },
    requestingUser?: { id: string; role: string }
  ) {
    const user = await UserStore.findById(userId);
    if (!user) throw new Error("User not found");

    // Only allow user to edit themselves or admin to edit anyone
    if (requestingUser && requestingUser.id !== userId && requestingUser.role !== "admin") {
      throw new Error("Unauthorized: can only edit your own profile");
    }

    const updateData: any = {};

    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }

    if (updates.email !== undefined) {
      const existing = await UserStore.findByEmail(updates.email);
      if (existing && existing._id.toString() !== userId) {
        throw new Error("Email already in use");
      }
      updateData.email = updates.email;
    }

    if (updates.password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updates.password, salt);
    }

    const updated = await UserStore.update(userId, updateData);
    if (!updated) throw new Error("Failed to update user");

    return {
      id: updated._id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      companyStatus: updated.companyStatus,
    };
  }

  static async deleteUser(
    userId: string,
    requestingUser?: { id: string; role: string }
  ) {
    const user = await UserStore.findById(userId);
    if (!user) throw new Error("User not found");

    // Only allow user to delete themselves or admin to delete anyone
    if (requestingUser && requestingUser.id !== userId && requestingUser.role !== "admin") {
      throw new Error("Unauthorized: can only delete your own account");
    }

    const deleted = await UserStore.delete(userId);
    if (!deleted) throw new Error("Failed to delete user");

    return {
      id: deleted._id,
      email: deleted.email,
      message: "User deleted successfully",
    };
  }
}
