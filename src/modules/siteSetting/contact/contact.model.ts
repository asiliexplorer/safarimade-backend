// modules/contact/contact.model.ts
import mongoose, { Schema } from "mongoose";
import { IContactDocument } from "./contact.types";
 
const SpecialistSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String },
    phone: { type: String },
    email: { type: String },
    bio: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ContactSchema = new Schema<IContactDocument>(
  {
    heading: { type: String, default: "Contact Us" },
    subtitle: {
      type: String,
      default: "OUR SPECIALISTS ARE HERE TO ASSIST YOU",
    },
    phones: {
      usa: { type: String },
      uk: { type: String },
      other: { type: String },
    },
    email: { type: String },
    address: { type: String },
    specialists: { type: [SpecialistSchema], default: [] },
  },
  { timestamps: true }
);

const ContactModel =
  mongoose.models.Contact ||
  mongoose.model<IContactDocument>("Contact", ContactSchema);

export default ContactModel;
