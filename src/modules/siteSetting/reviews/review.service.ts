import { ReviewModel, IReview } from "./review.model";
import mongoose from "mongoose";

export async function createReview(payload: Partial<IReview>) {
  return ReviewModel.create(payload);
}

/**
 * List reviews.
 * Supports query: { enabled?: 'true'|'false', featured?: 'true'|'false', limit?, skip?, sort? }
 */
export async function getAllReviews(opts: {
  enabled?: string;
  featured?: string;
  limit?: number;
  skip?: number;
  sort?: string;
}) {
  const filter: any = {};
  if (opts.enabled === "true") filter.enabled = true;
  if (opts.enabled === "false") filter.enabled = false;
  if (opts.featured === "true") filter.featured = true;
  if (opts.featured === "false") filter.featured = false;

  const q = ReviewModel.find(filter);
  if (opts.sort) q.sort(opts.sort);
  q.skip(opts.skip || 0);
  q.limit(opts.limit || 50);
  return q.lean();
}

export async function getReviewById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return ReviewModel.findById(id).lean();
}

export async function replaceReviewById(id: string, payload: Partial<IReview>) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return ReviewModel.findByIdAndUpdate(id, payload, { new: true }).lean();
}

export async function updateReviewById(id: string, payload: Partial<IReview>) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await ReviewModel.findById(id);
  if (!doc) return null;

  // Only update provided fields
  const updatable = [
    "author",
    "avatarUrl",
    "title",
    "content",
    "rating",
    "date",
    "source",
    "enabled",
    "featured",
  ] as (keyof IReview)[];
  updatable.forEach((f) => {
    if ((payload as any)[f] !== undefined) {
      (doc as any)[f] = (payload as any)[f];
    }
  });

  await doc.save();
  return doc.toObject();
}

/**
 * Soft-delete or hard-delete? This removes the document.
 * If you prefer soft-delete, change to set { enabled: false } instead of delete.
 */
export async function deleteReviewById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return ReviewModel.findByIdAndDelete(id);
}

/** Convenience toggle */
export async function setReviewEnabled(id: string, enabled: boolean) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return ReviewModel.findByIdAndUpdate(id, { enabled }, { new: true }).lean();
}

export async function setReviewFeatured(id: string, featured: boolean) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return ReviewModel.findByIdAndUpdate(id, { featured }, { new: true }).lean();
}
