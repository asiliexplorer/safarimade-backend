"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: {
        type: String,
        enum: ["admin", "customer", "company"],
        default: "customer",
    },
    // 👇 FIXED: Default removed so only company gets it manually
    companyStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: undefined,
    },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("User", UserSchema);
