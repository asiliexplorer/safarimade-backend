// src/modules/auth/auth.service.ts
import * as jwt from "jsonwebtoken";
import { UserStore } from "./auth.store";
import { getJwtSecret } from "../../common/jwt"; 

const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

export class AuthService {
  static async register(email: string, password: string, name?: string) {
    const existing = await UserStore.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const user = await UserStore.create({
      email,
      password,
      name,
      role: "admin",
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  static async login(email: string, password: string) {
    const user = await UserStore.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const storedPassword = user.password;
    if (!storedPassword || password !== storedPassword) {
      throw new Error("Invalid credentials");
    }

    const secret = getJwtSecret();

    if (!secret) {
      throw new Error("JWT secret is not configured (getJwtSecret returned empty)");
    }

    const typedSecret: jwt.Secret = secret as unknown as jwt.Secret;

    const token = (jwt.sign as any)(
      {
        sub: String(user._id),
        email: user.email,
        role: user.role,
      },
      typedSecret,
      { expiresIn: JWT_EXPIRES_IN }
    ) as string;

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async listUsers(
    filters: any = {},
    options: { limit?: number; skip?: number } = {}
  ) {
    const projection = { __v: 0 };
    const users = await UserStore.findMany(filters, projection, options);
    const total = await UserStore.count(filters);

    const items = users.map((user: any) => {
      const plain = typeof user?.toObject === "function" ? user.toObject() : user;
      return {
        ...plain,
        password: plain?.password ?? user?.password,
      };
    });

    return {
      items,
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
      password: user.password,
      createdAt: user.createdAt,
    };
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
      updateData.password = updates.password;
    }

    const updated = await UserStore.update(userId, updateData);
    if (!updated) throw new Error("Failed to update user");

    return {
      id: updated._id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
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
