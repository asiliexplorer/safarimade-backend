"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidator = registerValidator;
exports.loginValidator = loginValidator;
const joi_1 = __importDefault(require("joi"));
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    name: joi_1.default.string().optional(),
    role: joi_1.default.string().valid("admin", "customer", "company").optional(), // only if you allow role in body
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
function registerValidator(req, res, next) {
    const { error } = registerSchema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, error: error.message });
    next();
}
function loginValidator(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, error: error.message });
    next();
}
