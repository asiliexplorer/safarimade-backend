// modules/faq/faq.service.ts
import FaqModel from "./faq.model";
import { IFaq } from "./faq.types";
import mongoose from "mongoose";

export interface ListOptions {
  q?: string;
  category?: string;
  tags?: string[]; // match any
  published?: boolean | undefined;
  page?: number;
  limit?: number;
  sort?: string; // e.g. "order:asc,createdAt:desc"
}

/**
 * Public list with search + pagination
 */
export async function listFaqs(options: ListOptions) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.max(1, Math.min(100, options.limit ?? 20));
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (options.q) {
    // text search on question & answer
    const q = options.q.trim();
    filter.$or = [
      { question: new RegExp(escapeRegExp(q), "i") },
      { answer: new RegExp(escapeRegExp(q), "i") },
    ];
  }
  if (typeof options.published === "boolean")
    filter.published = options.published;
  if (options.category) filter.category = options.category;
  if (options.tags && options.tags.length) filter.tags = { $in: options.tags };

  // simple sort parsing
  let sort: any = { order: 1, createdAt: -1 };
  if (options.sort) {
    sort = {};
    options.sort.split(",").forEach((s) => {
      const [k, dir] = s.split(":").map((x) => x.trim());
      sort[k] = dir === "desc" || dir === "-1" ? -1 : 1;
    });
  }

  const [items, total] = await Promise.all([
    FaqModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    FaqModel.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

/** Get single FAQ */
export async function getFaqById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return FaqModel.findById(id).lean();
}

/** Create */
export async function createFaq(payload: Partial<IFaq>) {
  const doc = new FaqModel(payload);
  await doc.save();
  return doc.toObject();
}

/** Update */
export async function updateFaq(id: string, payload: Partial<IFaq>) {
  const updated = await FaqModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  ).lean();
  return updated;
}

/** Delete */
export async function removeFaq(id: string) {
  return FaqModel.findByIdAndDelete(id).lean();
}

/** Toggle publish flag */
export async function setPublishState(id: string, published: boolean) {
  return FaqModel.findByIdAndUpdate(
    id,
    { $set: { published } },
    { new: true }
  ).lean();
}

/** Helper */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
