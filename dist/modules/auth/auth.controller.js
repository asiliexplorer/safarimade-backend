"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async listUsers(req, res, next) {
        try {
            // parse pagination params
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Number(req.query.limit) || 50);
            const skip = (page - 1) * limit;
            // Users page is admin-only
            const filters = { role: "admin" };
            if (req.query.email)
                filters.email = String(req.query.email);
            if (req.query.name)
                filters.name = { $regex: String(req.query.name), $options: "i" };
            const result = await auth_service_1.AuthService.listUsers(filters, { limit, skip });
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async getUserById(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await auth_service_1.AuthService.getUserById(userId);
            res.json({ success: true, data: user });
        }
        catch (err) {
            next(err);
        }
    }
    static async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const user = await auth_service_1.AuthService.register(email, password, name);
            res.status(201).json({ success: true, data: user });
        }
        catch (err) {
            next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            console.log("[AuthController][Backend] Login attempt:", email, "with password length:", password);
            const result = await auth_service_1.AuthService.login(email, password);
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async me(req, res) {
        res.json({ success: true, data: req.user });
    }
    static async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const updates = req.body;
            const requestingUser = req.user;
            const updated = await auth_service_1.AuthService.updateUser(userId, updates, requestingUser);
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;
            const requestingUser = req.user;
            const deleted = await auth_service_1.AuthService.deleteUser(userId, requestingUser);
            res.json({ success: true, data: deleted });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
