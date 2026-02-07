// modules/footer/footer.model.ts
import mongoose, { Schema } from "mongoose";
import { IFooterDocument } from "./footer.types";

const GallerySchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const LinkSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SocialSchema = new Schema(
  {
    provider: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FooterSchema = new Schema<IFooterDocument>(
  {
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
        default:
          "Receive travel ideas, destination guides, and inspiration directly in your inbox.",
      },
      placeholderName: { type: String, default: "Your name" },
      placeholderEmail: { type: String, default: "Your e-mail" },
      signupText: { type: String, default: "SIGN UP" },
    },
    gallery: { type: [GallerySchema], default: [] },
    social: { type: [SocialSchema], default: [] },
  },
  { timestamps: true }
);

const FooterModel =
  mongoose.models.Footer ||
  mongoose.model<IFooterDocument>("Footer", FooterSchema);
export default FooterModel;
