"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.getAllReviews = getAllReviews;
exports.getReviewById = getReviewById;
exports.replaceReviewById = replaceReviewById;
exports.updateReviewById = updateReviewById;
exports.deleteReviewById = deleteReviewById;
exports.setReviewEnabled = setReviewEnabled;
exports.setReviewFeatured = setReviewFeatured;
const review_model_1 = require("./review.model");
const mongoose_1 = __importDefault(require("mongoose"));
async function createReview(payload) {
    return review_model_1.ReviewModel.create(payload);
}
/**
 * List reviews.
 * Supports query: { enabled?: 'true'|'false', featured?: 'true'|'false', limit?, skip?, sort? }
 */
async function getAllReviews(opts) {
    const filter = {};
    if (opts.enabled === "true")
        filter.enabled = true;
    if (opts.enabled === "false")
        filter.enabled = false;
    if (opts.featured === "true")
        filter.featured = true;
    if (opts.featured === "false")
        filter.featured = false;
    const q = review_model_1.ReviewModel.find(filter);
    if (opts.sort)
        q.sort(opts.sort);
    q.skip(opts.skip || 0);
    q.limit(opts.limit || 50);
    return q.lean();
}
async function getReviewById(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return review_model_1.ReviewModel.findById(id).lean();
}
async function replaceReviewById(id, payload) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return review_model_1.ReviewModel.findByIdAndUpdate(id, payload, { new: true }).lean();
}
async function updateReviewById(id, payload) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    const doc = await review_model_1.ReviewModel.findById(id);
    if (!doc)
        return null;
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
    ];
    updatable.forEach((f) => {
        if (payload[f] !== undefined) {
            doc[f] = payload[f];
        }
    });
    await doc.save();
    return doc.toObject();
}
/**
 * Soft-delete or hard-delete? This removes the document.
 * If you prefer soft-delete, change to set { enabled: false } instead of delete.
 */
async function deleteReviewById(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return review_model_1.ReviewModel.findByIdAndDelete(id);
}
/** Convenience toggle */
async function setReviewEnabled(id, enabled) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return review_model_1.ReviewModel.findByIdAndUpdate(id, { enabled }, { new: true }).lean();
}
async function setReviewFeatured(id, featured) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return review_model_1.ReviewModel.findByIdAndUpdate(id, { featured }, { new: true }).lean();
}
