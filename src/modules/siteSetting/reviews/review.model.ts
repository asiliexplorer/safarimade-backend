import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  author: string;
  avatarUrl?: string;
  title?: string;
  content: string;
  rating: number; // 1-5
  date?: Date; // date of the review (e.g. 2025-10-19)
  source?: string; // e.g. "Tripadvisor"
  enabled: boolean; // visible on public site
  featured?: boolean; // shown in carousel first
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    author: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    title: { type: String, default: "" },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
    source: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
