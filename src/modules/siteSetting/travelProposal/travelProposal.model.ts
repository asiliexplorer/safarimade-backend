import mongoose, { Schema } from "mongoose";
import { ITravelProposalDocument } from "./travelProposal.types";

const TravelProposalSchema = new Schema<ITravelProposalDocument>(
  {
    destinationKnowledge: { type: String, required: true, trim: true },
    destination: { type: String, trim: true, default: "" },
    reasons: { type: [String], default: [] },
    tripDuration: { type: Number, required: true, min: 1 },
    arrivalDate: { type: String, required: true, trim: true },
    travelWith: { type: String, required: true, trim: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, required: true, min: 0 },
    budget: { type: Number, required: true, min: 0 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    wattsapp: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: "" },
    newsletter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TravelProposalModel =
  mongoose.models.TravelProposal ||
  mongoose.model<ITravelProposalDocument>("TravelProposal", TravelProposalSchema);

export default TravelProposalModel;
