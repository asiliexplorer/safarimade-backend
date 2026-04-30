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
exports.PackageModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DestinationAccommodationSchema = new mongoose_1.Schema({
    name: String,
    type: String,
    highlights: [String],
    images: [String],
}, { _id: false });
const DestinationDetailedSchema = new mongoose_1.Schema({
    place: String,
    nights: Number,
    description: String,
    accommodation: DestinationAccommodationSchema,
}, { _id: false });
// (kept only DestinationAccommodationSchema and DestinationDetailedSchema)
const PackageSchema = new mongoose_1.Schema({
    id: { type: Number, unique: true, sparse: true, index: true, min: 1 },
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, index: true },
    offeredBy: { type: String, trim: true, default: "Asili Explorer Safaris" },
    category: {
        type: String,
        enum: ["SAFARI", "WILDEBEEST", "KILIMANJARO", "ZANZIBAR"],
        required: true,
    },
    duration: Number,
    nights: Number,
    travelStyle: String,
    themes: [String],
    bestFor: [String],
    experienceSummary: String,
    shortDescription: String,
    fullDescription: String,
    destinationsDetailed: { type: [DestinationDetailedSchema], default: [] },
    // only keep destinationsDetailed (other complex lists removed)
    highlights: { type: [String], default: [] },
    mainImage: String,
    gallery: { type: [String], default: [] },
    priceType: { type: String, enum: ["FIXED", "CUSTOM"], required: true, default: "FIXED" },
    priceFrom: Number,
    currency: { type: String, default: "USD" },
    pricingNotes: String,
    inclusions: {
        included: { type: [String], default: [] },
        excluded: { type: [String], default: [] },
    },
    gettingThere: {
        description: String,
    },
    // customization fields removed
    isActive: { type: Boolean, default: true },
    // createdByAdmin removed
}, { timestamps: true });
PackageSchema.pre("validate", function packageSlugize(next) {
    if (!this.slug && this.name) {
        this.slug = String(this.name)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }
    next();
});
exports.PackageModel = mongoose_1.default.models.Package || mongoose_1.default.model("Package", PackageSchema);
