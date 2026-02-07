import { Request, Response } from "express";
import * as reviewService from "./review.service";

/**
 * GET /api/reviews
 * public: supports query params: enabled, featured, limit, skip, sort
 */
export async function listReviews(req: Request, res: Response) {
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
export async function getReview(req: Request, res: Response) {
  const id = req.params.id;
  const data = await reviewService.getReviewById(id);
  if (!data)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data });
}

/**
 * POST /api/reviews  (admin)
 */
export async function createReview(req: Request, res: Response) {
  const payload = req.body;
  const created = await reviewService.createReview(payload);
  res.status(201).json({ success: true, data: created });
}

/**
 * PUT /api/reviews/:id  (full replace) - admin
 */
export async function putReview(req: Request, res: Response) {
  const id = req.params.id;
  const updated = await reviewService.replaceReviewById(id, req.body);
  if (!updated)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: updated });
}

/**
 * PATCH /api/reviews/:id  (partial update) - admin
 */
export async function patchReview(req: Request, res: Response) {
  const id = req.params.id;
  const updated = await reviewService.updateReviewById(id, req.body);
  if (!updated)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: updated });
}

/**
 * DELETE /api/reviews/:id - admin
 */
export async function removeReview(req: Request, res: Response) {
  const id = req.params.id;
  await reviewService.deleteReviewById(id);
  res.json({ success: true, message: "Deleted" });
}

/**
 * PATCH /api/reviews/:id/enable - admin
 * body: { enabled: boolean }
 */
export async function toggleEnabled(req: Request, res: Response) {
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
export async function toggleFeatured(req: Request, res: Response) {
  const id = req.params.id;
  const featured = Boolean(req.body.featured);
  const updated = await reviewService.setReviewFeatured(id, featured);
  if (!updated)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: updated });
}
