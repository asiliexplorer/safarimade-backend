// modules/faq/faq.model.ts
import mongoose, { Schema } from "mongoose";
import { IFaqDocument } from "./faq.types";

const FaqSchema = new Schema<IFaqDocument>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 1000 },
    published: { type: Boolean, default: true },
    image: {
      type: String,
      default: "/mnt/data/0ebde9fc-b4d8-4c4b-add2-d1cb7fdec5f1.png",
    },
  },
  { timestamps: true }
);

const FaqModel =
  mongoose.models.Faq || mongoose.model<IFaqDocument>("Faq", FaqSchema);
export default FaqModel;
