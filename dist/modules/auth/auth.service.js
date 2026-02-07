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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/modules/auth/auth.service.ts
const jwt = __importStar(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_store_1 = require("./auth.store");
const jwt_1 = require("../../common/jwt"); // ensure this file exists
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
class AuthService {
    static async register(email, password, name, role) {
        const existing = await auth_store_1.UserStore.findByEmail(email);
        if (existing)
            throw new Error("User already exists");
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = await auth_store_1.UserStore.create({
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
    static async login(email, password) {
        const user = await auth_store_1.UserStore.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        if (user.role === "company" && user.companyStatus === "rejected") {
            throw new Error("Your company account was rejected by admin");
        }
        const match = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!match)
            throw new Error("Invalid credentials");
        // get secret at runtime
        const secret = (0, jwt_1.getJwtSecret)();
        // Make sure secret exists; this guarantees correct typing for jwt.sign overload
        if (!secret) {
            throw new Error("JWT secret is not configured (getJwtSecret returned empty)");
        }
        // Cast to jwt.Secret for clarity (may be unused by TS if we cast sign to any below)
        const typedSecret = secret;
        // --- IMPORTANT: use a local cast to `any` for jwt.sign so TS doesn't try to match
        // the overloaded signatures that are causing the compiler error in your environment.
        const token = jwt.sign({
            sub: String(user._id),
            email: user.email,
            role: user.role,
            companyStatus: user.companyStatus,
        }, typedSecret, { expiresIn: JWT_EXPIRES_IN });
        // Masked logging for debug (safe): *DO NOT* enable full token/secret in production logs
        try {
            console.log(">>> ISSUED TOKEN (prefix):", (token ?? "").substring(0, 40) + "...");
            console.log(">>> SIGN SECRET (masked):", secret
                ? `${String(secret).slice(0, 4)}...${String(secret).slice(-4)}`
                : "(empty)");
        }
        catch (e) {
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
    static async listUsers(filters = {}, options = {}) {
        const projection = { passwordHash: 0, __v: 0 };
        const users = await auth_store_1.UserStore.findMany(filters, projection, options);
        const total = await auth_store_1.UserStore.count(filters);
        return {
            items: users,
            total,
            limit: options.limit || 0,
            skip: options.skip || 0,
        };
    }
    static async listCompanies(status, options = {}) {
        const filters = { role: "company" };
        if (status)
            filters.companyStatus = status;
        const projection = { passwordHash: 0, __v: 0 };
        const companies = await auth_store_1.UserStore.findMany(filters, projection, options);
        const total = await auth_store_1.UserStore.count(filters);
        return {
            items: companies,
            total,
            limit: options.limit || 0,
            skip: options.skip || 0,
        };
    }
    static async setCompanyStatus(companyId, status) {
        const updated = await auth_store_1.UserStore.update(companyId, {
            companyStatus: status,
        });
        if (!updated)
            throw new Error("Company not found");
        return updated;
    }
}
exports.AuthService = AuthService;
