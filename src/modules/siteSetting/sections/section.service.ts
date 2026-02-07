// src/modules/siteSetting/sections/section.service.ts
import { SectionModel, ISection, IFeature } from "./section.model";

/**
 * Get all sections
 */
export async function getAllSections() {
  return SectionModel.find().sort({ order: 1 }).lean();
}

/**
 * Get section by key
 */
export async function getSectionByKey(key: string) {
  return SectionModel.findOne({ key }).lean();
}

/**
 * PATCH partial update
 */
export async function updateSectionByKey(
  key: string,
  payload: Partial<ISection> & {
    replaceFeatures?: IFeature[];
    addFeature?: IFeature;
    removeFeatureAt?: number;
    moveFeature?: { from: number; to: number };
  }
) {
  const doc = await SectionModel.findOne({ key });
  if (!doc) return null;

  // Ensure features exists and is an array before any operations
  if (!Array.isArray(doc.features)) {
    doc.features = [];
  }

  // FULL Replace features
  if (payload.replaceFeatures) {
    doc.features = payload.replaceFeatures;
  }

  // Add a single feature (doc.features guaranteed to be array)
  if (payload.addFeature) {
    doc.features.push(payload.addFeature);
  }

  // Remove by index (safe checks)
  if (
    typeof payload.removeFeatureAt === "number" &&
    Number.isInteger(payload.removeFeatureAt) &&
    payload.removeFeatureAt >= 0 &&
    payload.removeFeatureAt < doc.features.length
  ) {
    doc.features.splice(payload.removeFeatureAt, 1);
  }

  // Move feature (safe checks and handle index shift)
  if (payload.moveFeature) {
    const { from, to } = payload.moveFeature;
    if (
      Number.isInteger(from) &&
      Number.isInteger(to) &&
      from >= 0 &&
      from < doc.features.length &&
      to >= 0 &&
      to <= doc.features.length
    ) {
      // remove item
      const [item] = doc.features.splice(from, 1);
      // if removing an earlier index, the target index shifts left by 1
      const insertIndex = from < to ? Math.max(0, to - 1) : to;
      doc.features.splice(insertIndex, 0, item);
    }
  }

  // Update other allowed fields (whitelist)
  const updatable = [
    "title",
    "subtitle",
    "intro",
    "media",
    "stats",
    "order",
  ] as const;
  type UpdatableKey = (typeof updatable)[number];

  for (const field of updatable) {
    const k = field as UpdatableKey;
    // access payload with a safe cast; only set if provided
    const value = (payload as Partial<ISection> & Record<string, unknown>)[k];
    if (value !== undefined) {
      // Mongoose Document typing can be tricky; cast to any for assignment
      (doc as any)[k] = value;
    }
  }

  await doc.save();
  return doc.toObject();
}

/**
 * PUT full replace
 */
export async function replaceSectionByKey(
  key: string,
  payload: Partial<ISection>
) {
  return SectionModel.findOneAndUpdate({ key }, payload, {
    new: true,
    upsert: false,
  }).lean();
}

/**
 * Delete section
 */
export async function deleteSectionByKey(key: string) {
  return SectionModel.findOneAndDelete({ key });
}
