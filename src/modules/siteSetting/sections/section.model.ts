import mongoose, { Document, Schema } from "mongoose";

export interface IFeature {
  title: string;
  subtitle?: string;
  icon?: string; // optional icon name or url
}

export interface IStat {
  label: string;
  value: string;
}

export interface ISection extends Document {
  key: string; // unique key e.g. "why-choose"
  title: string;
  subtitle?: string;
  intro?: string;
  features?: IFeature[]; // left list in screenshot
  media?: {
    type: "image" | "video";
    url: string;
    caption?: string;
  } | null;
  stats?: IStat[]; // small cards like "15+ Years Exp"
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>({
  title: { type: String, required: true },
  subtitle: { type: String },
  icon: { type: String },
});

const StatSchema = new Schema<IStat>({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const SectionSchema = new Schema<ISection>(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    intro: { type: String },
    features: { type: [FeatureSchema], default: [] },
    media: {
      type: {
        type: String,
        enum: ["image", "video", null],
        default: null,
      },
      url: { type: String, default: "" },
      caption: { type: String, default: "" },
    },
    stats: { type: [StatSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SectionModel = mongoose.model<ISection>("Section", SectionSchema);
