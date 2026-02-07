"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
// src/common/jwt.ts
function getJwtSecret() {
    const s = process.env.JWT_SECRET;
    if (!s || !String(s).trim()) {
        // development fallback; in production prefer to throw
        return "changeme";
    }
    return String(s).trim();
}
