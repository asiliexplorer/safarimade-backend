"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackage = createPackage;
exports.listPackages = listPackages;
exports.getPackageById = getPackageById;
exports.updatePackageById = updatePackageById;
exports.deletePackageById = deletePackageById;
const mongoose_1 = __importDefault(require("mongoose"));
const package_model_1 = require("./package.model");
async function createPackage(payload) {
    return package_model_1.PackageModel.create(payload);
}
async function listPackages(options) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
    const skip = (page - 1) * limit;
    const filter = {};
    if (options.category) {
        filter.category = options.category;
    }
    if (options.isActive === "true")
        filter.isActive = true;
    if (options.isActive === "false")
        filter.isActive = false;
    if (options.createdByAdmin === "true")
        filter.createdByAdmin = true;
    if (options.createdByAdmin === "false")
        filter.createdByAdmin = false;
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
    const sort = { [sortBy]: sortOrder };
    const [items, total] = await Promise.all([
        package_model_1.PackageModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        package_model_1.PackageModel.countDocuments(filter),
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
async function getPackageById(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return package_model_1.PackageModel.findById(id).lean();
}
async function updatePackageById(id, payload) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return package_model_1.PackageModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
}
async function deletePackageById(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return package_model_1.PackageModel.findByIdAndDelete(id);
}
