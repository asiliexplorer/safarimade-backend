import mongoose, { Document, Schema } from "mongoose";

export interface IPackage extends Document {
  id?: number;
  name: string;
  slug?: string;
  offeredBy?: string;
  category: "SAFARI" | "WILDEBEEST" | "KILIMANJARO" | "ZANZIBAR";
  duration?: number;
  nights?: number;
  travelStyle?: string;
  themes?: string[];
  bestFor?: string[];
  experienceSummary?: string;
  shortDescription?: string;
  fullDescription?: string;
  destinationsDetailed: Array<{
    place?: string;
    nights?: number;
    description?: string;
    accommodation?: {
      name?: string;
      type?: string;
      highlights?: string[];
      images?: string[];
    };
  }>;
  highlights?: string[];
  mainImage?: string;
  gallery?: string[];
  priceType: "FIXED" | "CUSTOM";
  priceFrom?: number;
  currency?: string;
  pricingNotes?: string;
  inclusions?: {
    included?: string[];
    excluded?: string[];
  };
  gettingThere?: {
    description?: string;
  };
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationAccommodationSchema = new Schema(
  {
    name: String,
    type: String,
    highlights: [String],
    images: [String],
  },
  { _id: false }
);

const DestinationDetailedSchema = new Schema(
  {
    place: String,
    nights: Number,
    description: String,
    accommodation: DestinationAccommodationSchema,
  },
  { _id: false }
);

// (kept only DestinationAccommodationSchema and DestinationDetailedSchema)

const PackageSchema = new Schema<IPackage>(
  {
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
  },
  { timestamps: true }
);

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

export const PackageModel = mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);