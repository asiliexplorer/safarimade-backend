import mongoose from "mongoose";
import { IPackage, PackageModel } from "./package.schema";

const DEFAULT_OFFERED_BY = "Asili Explorer Safaris";
const PACKAGE_COUNTER_ID = "package-id";

const PackageCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const PackageCounterModel =
  mongoose.models.PackageCounter || mongoose.model("PackageCounter", PackageCounterSchema);

function makeSlug(value: string) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isPositiveInteger(value: unknown) {
  return Number.isInteger(value) && Number(value) > 0;
}

function buildPackageQuery(identifier: string) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return { _id: new mongoose.Types.ObjectId(identifier) };
  }

  const numericId = Number(identifier);
  if (isPositiveInteger(numericId)) {
    return { id: numericId };
  }

  return null;
}

async function syncPackageIdFloor(id: number) {
  await PackageCounterModel.findByIdAndUpdate(
    PACKAGE_COUNTER_ID,
    { $max: { seq: id } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function getNextPackageId() {
  const counter = await PackageCounterModel.findByIdAndUpdate(
    PACKAGE_COUNTER_ID,
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return counter?.seq || 1;
}

async function ensurePackageIdAvailable(id: number, excludeId?: string) {
  const query: Record<string, unknown> = { id };
  if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
  }

  const existing = await PackageModel.exists(query);
  if (existing) {
    const error: any = new Error(`Package ID ${id} already exists`);
    error.status = 400;
    throw error;
  }
}

type ListPackageOptions = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export async function createPackage(payload: Partial<IPackage>) {
  const nextPayload = { ...payload } as Partial<IPackage>;
  const preferredId = Number(nextPayload.id);

  nextPayload.offeredBy = String(nextPayload.offeredBy || DEFAULT_OFFERED_BY).trim() || DEFAULT_OFFERED_BY;

  if (isPositiveInteger(preferredId)) {
    await ensurePackageIdAvailable(preferredId);
    nextPayload.id = preferredId;
    await syncPackageIdFloor(preferredId);
  } else {
    nextPayload.id = await getNextPackageId();
  }

  return PackageModel.create(nextPayload);
}

export async function listPackages(options: ListPackageOptions) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (options.category) {
    filter.category = options.category;
  }

  if (options.isActive === "true") filter.isActive = true;
  if (options.isActive === "false") filter.isActive = false;

  if (options.search && options.search.trim()) {
    const search = options.search.trim();
    const regex = new RegExp(search, "i");
    filter.$or = [
      { name: regex },
      { slug: regex },
      { travelStyle: regex },
      { shortDescription: regex },
      { fullDescription: regex },
      { experienceSummary: regex },
      { "destinationsDetailed.place": regex },
    ];
  }

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

  const [items, total] = await Promise.all([
    PackageModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    PackageModel.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getPackageById(id: string) {
  const query = buildPackageQuery(id);
  if (!query) return null;
  return PackageModel.findOne(query).lean();
}

export async function getPackageBySlug(slug: string) {
  if (!slug) return null;
  return PackageModel.findOne({ slug }).lean();
}

export async function updatePackageById(id: string, payload: Partial<IPackage>) {
  const query = buildPackageQuery(id);
  if (!query) return null;

  const current = (await PackageModel.findOne(query).select("id").lean()) as { id?: number } | null;
  if (!current) return null;

  const nextPayload = { ...payload } as Partial<IPackage>;
  if (nextPayload.name && !nextPayload.slug) {
    nextPayload.slug = makeSlug(nextPayload.name);
  }

  if (nextPayload.offeredBy !== undefined) {
    nextPayload.offeredBy = String(nextPayload.offeredBy).trim() || DEFAULT_OFFERED_BY;
  }

  if (nextPayload.id !== undefined) {
    const preferredId = Number(nextPayload.id);
    if (!isPositiveInteger(preferredId)) {
      const error: any = new Error("Package ID must be a positive number");
      error.status = 400;
      throw error;
    }

    if (Number(current.id) !== preferredId) {
      await ensurePackageIdAvailable(preferredId, id);
      await syncPackageIdFloor(preferredId);
    }

    nextPayload.id = preferredId;
  }

  return PackageModel.findOneAndUpdate(query, nextPayload, { new: true, runValidators: true }).lean();
}

export async function deletePackageById(id: string) {
  const query = buildPackageQuery(id);
  if (!query) return null;
  return PackageModel.findOneAndDelete(query);
}
