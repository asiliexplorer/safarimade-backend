"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        const user = req.user;
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
