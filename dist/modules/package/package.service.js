"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackage = createPackage;
exports.listPackages = listPackages;
exports.getPackageById = getPackageById;
exports.getPackageBySlug = getPackageBySlug;
exports.updatePackageById = updatePackageById;
exports.deletePackageById = deletePackageById;
const mongoose_1 = __importDefault(require("mongoose"));
const package_schema_1 = require("./package.schema");
const DEFAULT_OFFERED_BY = "Asili Explorer Safaris";
const PACKAGE_COUNTER_ID = "package-id";
const PackageCounterSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
}, { versionKey: false });
const PackageCounterModel = mongoose_1.default.models.PackageCounter || mongoose_1.default.model("PackageCounter", PackageCounterSchema);
function makeSlug(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
function isPositiveInteger(value) {
    return Number.isInteger(value) && Number(value) > 0;
}
function buildPackageQuery(identifier) {
    if (mongoose_1.default.Types.ObjectId.isValid(identifier)) {
        return { _id: new mongoose_1.default.Types.ObjectId(identifier) };
    }
    const numericId = Number(identifier);
    if (isPositiveInteger(numericId)) {
        return { id: numericId };
    }
    return null;
}
async function syncPackageIdFloor(id) {
    await PackageCounterModel.findByIdAndUpdate(PACKAGE_COUNTER_ID, { $max: { seq: id } }, { upsert: true, new: true, setDefaultsOnInsert: true });
}
async function getNextPackageId() {
    const counter = await PackageCounterModel.findByIdAndUpdate(PACKAGE_COUNTER_ID, { $inc: { seq: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return counter?.seq || 1;
}
async function ensurePackageIdAvailable(id, excludeId) {
    const query = { id };
    if (excludeId && mongoose_1.default.Types.ObjectId.isValid(excludeId)) {
        query._id = { $ne: new mongoose_1.default.Types.ObjectId(excludeId) };
    }
    const existing = await package_schema_1.PackageModel.exists(query);
    if (existing) {
        const error = new Error(`Package ID ${id} already exists`);
        error.status = 400;
        throw error;
    }
}
async function createPackage(payload) {
    const nextPayload = { ...payload };
    const preferredId = Number(nextPayload.id);
    nextPayload.offeredBy = String(nextPayload.offeredBy || DEFAULT_OFFERED_BY).trim() || DEFAULT_OFFERED_BY;
    if (isPositiveInteger(preferredId)) {
        await ensurePackageIdAvailable(preferredId);
        nextPayload.id = preferredId;
        await syncPackageIdFloor(preferredId);
    }
    else {
        nextPayload.id = await getNextPackageId();
    }
    return package_schema_1.PackageModel.create(nextPayload);
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
    const sort = { [sortBy]: sortOrder };
    const [items, total] = await Promise.all([
        package_schema_1.PackageModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        package_schema_1.PackageModel.countDocuments(filter),
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
    const query = buildPackageQuery(id);
    if (!query)
        return null;
    return package_schema_1.PackageModel.findOne(query).lean();
}
async function getPackageBySlug(slug) {
    if (!slug)
        return null;
    return package_schema_1.PackageModel.findOne({ slug }).lean();
}
async function updatePackageById(id, payload) {
    const query = buildPackageQuery(id);
    if (!query)
        return null;
    const current = (await package_schema_1.PackageModel.findOne(query).select("id").lean());
    if (!current)
        return null;
    const nextPayload = { ...payload };
    if (nextPayload.name && !nextPayload.slug) {
        nextPayload.slug = makeSlug(nextPayload.name);
    }
    if (nextPayload.offeredBy !== undefined) {
        nextPayload.offeredBy = String(nextPayload.offeredBy).trim() || DEFAULT_OFFERED_BY;
    }
    if (nextPayload.id !== undefined) {
        const preferredId = Number(nextPayload.id);
        if (!isPositiveInteger(preferredId)) {
            const error = new Error("Package ID must be a positive number");
            error.status = 400;
            throw error;
        }
        if (Number(current.id) !== preferredId) {
            await ensurePackageIdAvailable(preferredId, id);
            await syncPackageIdFloor(preferredId);
        }
        nextPayload.id = preferredId;
    }
    return package_schema_1.PackageModel.findOneAndUpdate(query, nextPayload, { new: true, runValidators: true }).lean();
}
async function deletePackageById(id) {
    const query = buildPackageQuery(id);
    if (!query)
        return null;
    return package_schema_1.PackageModel.findOneAndDelete(query);
}
