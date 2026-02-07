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
// modules/footer/footer.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const GallerySchema = new mongoose_1.Schema({
    src: { type: String, required: true },
    alt: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });
const LinkSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });
const SocialSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });
const FooterSchema = new mongoose_1.Schema({
    logoUrl: {
        type: String,
        default: "/mnt/data/fbb49cab-3903-47c2-a19a-d1cd6705e27f.png",
    },
    phone: { type: String },
    copyright: { type: String, default: "© 2025 Asili Explorer" },
    quickLinks: { type: [LinkSchema], default: [] },
    itineraries: { type: [LinkSchema], default: [] },
    travelInfo: { type: [LinkSchema], default: [] },
    newsletter: {
        title: { type: String, default: "SIGN UP FOR OUR NEWSLETTER" },
        subtitle: {
            type: String,
            default: "Receive travel ideas, destination guides, and inspiration directly in your inbox.",
        },
        placeholderName: { type: String, default: "Your name" },
        placeholderEmail: { type: String, default: "Your e-mail" },
        signupText: { type: String, default: "SIGN UP" },
    },
    gallery: { type: [GallerySchema], default: [] },
    social: { type: [SocialSchema], default: [] },
}, { timestamps: true });
const FooterModel = mongoose_1.default.models.Footer ||
    mongoose_1.default.model("Footer", FooterSchema);
exports.default = FooterModel;
