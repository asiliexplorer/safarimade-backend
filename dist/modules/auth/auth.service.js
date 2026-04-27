"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/modules/auth/auth.service.ts
const jwt = __importStar(require("jsonwebtoken"));
const auth_store_1 = require("./auth.store");
const jwt_1 = require("../../common/jwt");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
class AuthService {
    static async register(email, password, name) {
        const existing = await auth_store_1.UserStore.findByEmail(email);
        if (existing)
            throw new Error("User already exists");
        const user = await auth_store_1.UserStore.create({
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
    static async login(email, password) {
        const user = await auth_store_1.UserStore.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const storedPassword = user.password;
        if (!storedPassword || password !== storedPassword) {
            throw new Error("Invalid credentials");
        }
        const secret = (0, jwt_1.getJwtSecret)();
        if (!secret) {
            throw new Error("JWT secret is not configured (getJwtSecret returned empty)");
        }
        const typedSecret = secret;
        const token = jwt.sign({
            sub: String(user._id),
            email: user.email,
            role: user.role,
        }, typedSecret, { expiresIn: JWT_EXPIRES_IN });
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
    static async listUsers(filters = {}, options = {}) {
        const projection = { __v: 0 };
        const users = await auth_store_1.UserStore.findMany(filters, projection, options);
        const total = await auth_store_1.UserStore.count(filters);
        const items = users.map((user) => {
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
    static async getUserById(userId) {
        const user = await auth_store_1.UserStore.findById(userId);
        if (!user)
            throw new Error("User not found");
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
    static async updateUser(userId, updates, requestingUser) {
        const user = await auth_store_1.UserStore.findById(userId);
        if (!user)
            throw new Error("User not found");
        // Only allow user to edit themselves or admin to edit anyone
        if (requestingUser && requestingUser.id !== userId && requestingUser.role !== "admin") {
            throw new Error("Unauthorized: can only edit your own profile");
        }
        const updateData = {};
        if (updates.name !== undefined) {
            updateData.name = updates.name;
        }
        if (updates.email !== undefined) {
            const existing = await auth_store_1.UserStore.findByEmail(updates.email);
            if (existing && existing._id.toString() !== userId) {
                throw new Error("Email already in use");
            }
            updateData.email = updates.email;
        }
        if (updates.password !== undefined) {
            updateData.password = updates.password;
        }
        const updated = await auth_store_1.UserStore.update(userId, updateData);
        if (!updated)
            throw new Error("Failed to update user");
        return {
            id: updated._id,
            email: updated.email,
            name: updated.name,
            role: updated.role,
        };
    }
    static async deleteUser(userId, requestingUser) {
        const user = await auth_store_1.UserStore.findById(userId);
        if (!user)
            throw new Error("User not found");
        // Only allow user to delete themselves or admin to delete anyone
        if (requestingUser && requestingUser.id !== userId && requestingUser.role !== "admin") {
            throw new Error("Unauthorized: can only delete your own account");
        }
        const deleted = await auth_store_1.UserStore.delete(userId);
        if (!deleted)
            throw new Error("Failed to delete user");
        return {
            id: deleted._id,
            email: deleted.email,
            message: "User deleted successfully",
        };
    }
}
exports.AuthService = AuthService;
