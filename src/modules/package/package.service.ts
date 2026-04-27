import mongoose from "mongoose";
import { IPackage, PackageModel } from "./package.model";

type ListPackageOptions = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: string;
  createdByAdmin?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export async function createPackage(payload: Partial<IPackage>) {
  return PackageModel.create(payload);
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

  if (options.createdByAdmin === "true") filter.createdByAdmin = true;
  if (options.createdByAdmin === "false") filter.createdByAdmin = false;

  if (options.search && options.search.trim()) {
    const search = options.search.trim();
    const regex = new RegExp(search, "i");
    filter.$or = [
      { name: regex },
      { shortDescription: regex },
      { fullDescription: regex },
      { offeredBy: regex },
      { tourOperator: regex },
      { destinations: regex },
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
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return PackageModel.findById(id).lean();
}

export async function updatePackageById(id: string, payload: Partial<IPackage>) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return PackageModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
}

export async function deletePackageById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return PackageModel.findByIdAndDelete(id);
}
