// modules/faq/faq.types.ts
import { Document } from "mongoose";

export interface IFaq {
  question: string;
  answer: string;
  category?: string; // e.g. "Booking", "Health", "Payments"
  tags?: string[]; // small labels for filtering
  order?: number; // lower = higher in list
  published?: boolean; // show in public listing
  image?: string; // optional image URL to show alongside answer
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFaqDocument extends IFaq, Document {}
