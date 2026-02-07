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
exports.getFooterHandler = getFooterHandler;
exports.updateFooterHandler = updateFooterHandler;
const mongoose_1 = __importDefault(require("mongoose"));
const footerService = __importStar(require("./footer.service"));
/**
 * Helper: sanitize subdocument arrays before sending to Mongoose.
 * - If _id is a valid 24-char hex, convert to ObjectId so updates can target it.
 * - If _id is present but invalid, remove it so Mongoose creates a new one.
 * - Remove createdAt/updatedAt properties coming from client.
 */
function cleanSubdocs(arr) {
    if (!Array.isArray(arr))
        return [];
    return arr.map((item) => {
        if (!item || typeof item !== "object")
            return item;
        const copy = { ...item };
        // Normalize _id: if valid ObjectId string -> convert; else delete
        if (copy._id && typeof copy._id === "string") {
            if (mongoose_1.default.Types.ObjectId.isValid(copy._id)) {
                copy._id = new mongoose_1.default.Types.ObjectId(String(copy._id));
            }
            else {
                delete copy._id;
            }
        }
        // Remove createdAt/updatedAt sent by client
        delete copy.createdAt;
        delete copy.updatedAt;
        return copy;
    });
}
async function getFooterHandler(req, res, next) {
    try {
        const footer = await footerService.getFooter();
        if (!footer) {
            // sensible defaults
            return res.status(200).json({
                data: {
                    logoUrl: "/mnt/data/fbb49cab-3903-47c2-a19a-d1cd6705e27f.png",
                    phone: "+255 0767140150",
                    copyright: "© 2025 Asili Explorer",
                    quickLinks: [],
                    itineraries: [],
                    travelInfo: [],
                    newsletter: {},
                    gallery: [],
                    social: [],
                },
            });
        }
        return res.status(200).json({ data: footer });
    }
    catch (err) {
        next(err);
    }
}
async function updateFooterHandler(req, res, next) {
    try {
        const payload = req.body || {};
        // Basic type validation for array fields
        if (payload.quickLinks && !Array.isArray(payload.quickLinks)) {
            return res.status(400).json({ message: "quickLinks must be an array" });
        }
        if (payload.itineraries && !Array.isArray(payload.itineraries)) {
            return res.status(400).json({ message: "itineraries must be an array" });
        }
        if (payload.travelInfo && !Array.isArray(payload.travelInfo)) {
            return res.status(400).json({ message: "travelInfo must be an array" });
        }
        if (payload.gallery && !Array.isArray(payload.gallery)) {
            return res.status(400).json({ message: "gallery must be an array" });
        }
        if (payload.social && !Array.isArray(payload.social)) {
            return res.status(400).json({ message: "social must be an array" });
        }
        // SANITIZE arrays: remove invalid _id and createdAt/updatedAt fields
        const sanitizedPayload = { ...payload };
        sanitizedPayload.quickLinks = cleanSubdocs(payload.quickLinks);
        sanitizedPayload.itineraries = cleanSubdocs(payload.itineraries);
        sanitizedPayload.travelInfo = cleanSubdocs(payload.travelInfo);
        sanitizedPayload.gallery = cleanSubdocs(payload.gallery);
        sanitizedPayload.social = cleanSubdocs(payload.social);
        // Ensure newsletter is an object if provided
        if (sanitizedPayload.newsletter &&
            typeof sanitizedPayload.newsletter !== "object") {
            return res.status(400).json({ message: "newsletter must be an object" });
        }
        // Set updatedAt server-side
        sanitizedPayload.updatedAt = new Date();
        const updated = await footerService.upsertFooter(sanitizedPayload);
        return res.status(200).json({ message: "Footer updated", data: updated });
    }
    catch (err) {
        next(err);
    }
}
