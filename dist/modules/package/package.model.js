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
const DaySchema = new mongoose_1.Schema({
    day: { type: mongoose_1.Schema.Types.Mixed },
    location: String,
    description: String,
}, { _id: false });
const WildlifeSchema = new mongoose_1.Schema({
    animal: String,
    abundance: String,
}, { _id: false });
const DayByDaySchema = new mongoose_1.Schema({
    day: { type: mongoose_1.Schema.Types.Mixed },
    location: String,
    description: String,
    accommodation: String,
    accommodationType: String,
    meals: String,
    drinks: String,
    images: [String],
    bestTimeToVisit: String,
    highSeason: String,
    bestWeather: String,
    wildlife: [WildlifeSchema],
}, { _id: false });
const PricingSchema = new mongoose_1.Schema({
    period: String,
    solo: String,
    oneRoomTwoPeople: String,
    oneRoomThreePeople: String,
    oneRoomFourPeople: String,
    twoRoomsFivePeople: String,
    threeRoomsSixPeople: String,
}, { _id: false });
const PackageSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    offeredBy: String,
    tourOperator: String,
    category: {
        type: String,
        enum: ["SAFARIS", "WILDEBEEST", "KILIMANJARO", "ZANZIBAR"],
        required: true,
    },
    rating: Number,
    reviewCount: Number,
    shortDescription: String,
    fullDescription: String,
    duration: Number,
    price: Number,
    startingFrom: String,
    comfortLevel: String,
    tourType: String,
    safariType: String,
    specializedTours: [String],
    features: [String],
    image: String,
    gallery: [String],
    highlights: [String],
    destinations: [String],
    route: {
        start: String,
        end: String,
        days: [DaySchema],
    },
    tourFeatures: [String],
    activitiesTransportation: {
        activities: [String],
        vehicle: String,
        transfer: String,
    },
    accommodationMeals: {
        note: String,
        schedule: [
            {
                day: mongoose_1.Schema.Types.Mixed,
                accommodation: String,
                accommodationType: String,
                meals: String,
            },
        ],
    },
    dayByDay: [DayByDaySchema],
    rates: {
        disclaimer: String,
        pricing: [PricingSchema],
    },
    inclusions: {
        included: [String],
        excluded: [String],
    },
    gettingThere: {
        description: String,
        details: [String],
    },
    createdByAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.PackageModel = mongoose_1.default.model("Package", PackageSchema);
