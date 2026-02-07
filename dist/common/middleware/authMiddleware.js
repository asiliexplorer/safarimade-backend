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
exports.authMiddleware = authMiddleware;
const jwt = __importStar(require("jsonwebtoken"));
const auth_store_1 = require("../../modules/auth/auth.store");
async function authMiddleware(req, res, next) {
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
    }
    catch (e) {
        /* ignore */
    }
    const secret = (process.env.JWT_SECRET || "changeme")
        .toString()
        .trim();
    console.log(">>> VERIFY SECRET (masked):", secret
        ? `${String(secret).slice(0, 4)}...${String(secret).slice(-4)}`
        : "(empty)");
    try {
        const decoded = jwt.decode(token);
        console.log(">>> DECODED (no-verify):", decoded);
        // verify (this throws if invalid)
        const payload = jwt.verify(token, secret);
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
        const user = await auth_store_1.UserStore.findById(userId);
        if (!user) {
            console.log(">>> User not found for id:", userId);
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }
        req.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            companyStatus: user.companyStatus,
        };
        next();
    }
    catch (err) {
        console.error(">>> JWT VERIFY ERROR:", err && err.message ? err.message : err);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}
