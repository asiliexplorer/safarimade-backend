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
            // Optional filtering by role/email/name
            const filters = {};
            if (req.query.role)
                filters.role = req.query.role;
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
    static async listCompanies(req, res, next) {
        try {
            const status = req.query.status ? String(req.query.status) : undefined;
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Number(req.query.limit) || 50);
            const skip = (page - 1) * limit;
            const result = await auth_service_1.AuthService.listCompanies(status, { limit, skip });
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async register(req, res, next) {
        try {
            const { email, password, name, role } = req.body;
            const user = await auth_service_1.AuthService.register(email, password, name, role);
            res.status(201).json({ success: true, data: user });
        }
        catch (err) {
            next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
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
    static async setCompanyStatus(req, res, next) {
        try {
            const companyId = req.params.id;
            const { status } = req.body;
            const updated = await auth_service_1.AuthService.setCompanyStatus(companyId, status);
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
