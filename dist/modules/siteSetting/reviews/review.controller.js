"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReviews = listReviews;
exports.getReview = getReview;
exports.createReview = createReview;
exports.putReview = putReview;
exports.patchReview = patchReview;
exports.removeReview = removeReview;
exports.toggleEnabled = toggleEnabled;
exports.toggleFeatured = toggleFeatured;
const reviewService = __importStar(require("./review.service"));
/**
 * GET /api/reviews
 * public: supports query params: enabled, featured, limit, skip, sort
 */
async function listReviews(req, res) {
    const { enabled, featured, limit, skip, sort } = req.query;
    const data = await reviewService.getAllReviews({
        enabled: typeof enabled === "string" ? enabled : undefined,
        featured: typeof featured === "string" ? featured : undefined,
        limit: limit ? Number(limit) : undefined,
        skip: skip ? Number(skip) : undefined,
        sort: typeof sort === "string" ? sort : undefined,
    });
    res.json({ success: true, data });
}
/**
 * GET /api/reviews/:id
 */
async function getReview(req, res) {
    const id = req.params.id;
    const data = await reviewService.getReviewById(id);
    if (!data)
        return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
}
/**
 * POST /api/reviews  (admin)
 */
async function createReview(req, res) {
    const payload = req.body;
    const created = await reviewService.createReview(payload);
    res.status(201).json({ success: true, data: created });
}
/**
 * PUT /api/reviews/:id  (full replace) - admin
 */
async function putReview(req, res) {
    const id = req.params.id;
    const updated = await reviewService.replaceReviewById(id, req.body);
    if (!updated)
        return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
}
/**
 * PATCH /api/reviews/:id  (partial update) - admin
 */
async function patchReview(req, res) {
    const id = req.params.id;
    const updated = await reviewService.updateReviewById(id, req.body);
    if (!updated)
        return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
}
/**
 * DELETE /api/reviews/:id - admin
 */
async function removeReview(req, res) {
    const id = req.params.id;
    await reviewService.deleteReviewById(id);
    res.json({ success: true, message: "Deleted" });
}
/**
 * PATCH /api/reviews/:id/enable - admin
 * body: { enabled: boolean }
 */
async function toggleEnabled(req, res) {
    const id = req.params.id;
    const enabled = Boolean(req.body.enabled);
    const updated = await reviewService.setReviewEnabled(id, enabled);
    if (!updated)
        return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
}
/**
 * PATCH /api/reviews/:id/feature - admin
 * body: { featured: boolean }
 */
async function toggleFeatured(req, res) {
    const id = req.params.id;
    const featured = Boolean(req.body.featured);
    const updated = await reviewService.setReviewFeatured(id, featured);
    if (!updated)
        return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
}
