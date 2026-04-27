import mongoose, { Document, Schema } from "mongoose";

export interface IPackage extends Document {
  name: string;
  offeredBy?: string;
  tourOperator?: string;
  category: "SAFARIS" | "WILDEBEEST" | "KILIMANJARO" | "ZANZIBAR";
  rating?: number;
  reviewCount?: number;
  shortDescription?: string;
  fullDescription?: string;
  duration?: number;
  price?: number;
  startingFrom?: string;
  comfortLevel?: string;
  tourType?: string;
  safariType?: string;
  specializedTours?: string[];
  features?: string[];
  image?: string;
  gallery?: string[];
  highlights?: string[];
  destinations?: string[];
  route?: {
    start?: string;
    end?: string;
    days?: Array<{ day: string | number; location?: string; description?: string }>;
  };
  tourFeatures?: string[];
  activitiesTransportation?: {
    activities?: string[];
    vehicle?: string;
    transfer?: string;
  };
  accommodationMeals?: {
    note?: string;
    schedule?: Array<{
      day: string | number;
      accommodation?: string;
      accommodationType?: string;
      meals?: string;
    }>;
  };
  dayByDay?: Array<{
    day: string | number;
    location?: string;
    description?: string;
    accommodation?: string;
    accommodationType?: string;
    meals?: string;
    drinks?: string;
    images?: string[];
    bestTimeToVisit?: string;
    highSeason?: string;
    bestWeather?: string;
    wildlife?: Array<{ animal?: string; abundance?: string }>;
  }>;
  rates?: {
    disclaimer?: string;
    pricing?: Array<{
      period?: string;
      solo?: string;
      oneRoomTwoPeople?: string;
      oneRoomThreePeople?: string;
      oneRoomFourPeople?: string;
      twoRoomsFivePeople?: string;
      threeRoomsSixPeople?: string;
    }>;
  };
  inclusions?: {
    included?: string[];
    excluded?: string[];
  };
  gettingThere?: {
    description?: string;
    details?: string[];
  };
  createdByAdmin?: boolean;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DaySchema = new Schema(
  {
    day: { type: Schema.Types.Mixed },
    location: String,
    description: String,
  },
  { _id: false }
);

const WildlifeSchema = new Schema(
  {
    animal: String,
    abundance: String,
  },
  { _id: false }
);

const DayByDaySchema = new Schema(
  {
    day: { type: Schema.Types.Mixed },
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
  },
  { _id: false }
);

const PricingSchema = new Schema(
  {
    period: String,
    solo: String,
    oneRoomTwoPeople: String,
    oneRoomThreePeople: String,
    oneRoomFourPeople: String,
    twoRoomsFivePeople: String,
    threeRoomsSixPeople: String,
  },
  { _id: false }
);

const PackageSchema = new Schema<IPackage>(
  {
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
          day: Schema.Types.Mixed,
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
  },
  { timestamps: true }
);

export const PackageModel = mongoose.model<IPackage>("Package", PackageSchema);
