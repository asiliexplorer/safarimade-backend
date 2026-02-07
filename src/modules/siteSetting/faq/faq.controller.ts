// modules/faq/faq.controller.ts
import { Request, Response, NextFunction } from "express";
import * as faqService from "./faq.service";

export async function listFaqsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { q, category, tags, published, page, limit, sort } = req.query;
    const opts = {
      q: typeof q === "string" ? q : undefined,
      category: typeof category === "string" ? category : undefined,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      published:
        typeof published === "string" ? published === "true" : undefined,
      page: page ? parseInt(String(page), 10) : undefined,
      limit: limit ? parseInt(String(limit), 10) : undefined,
      sort: typeof sort === "string" ? sort : undefined,
    };
    const result = await faqService.listFaqs(opts);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getFaqHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const faq = await faqService.getFaqById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    return res.status(200).json({ data: faq });
  } catch (err) {
    next(err);
  }
}

export async function createFaqHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = req.body;
    if (!payload.question || !payload.answer)
      return res
        .status(400)
        .json({ message: "question and answer are required" });
    const created = await faqService.createFaq(payload);
    return res.status(201).json({ message: "FAQ created", data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateFaqHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updated = await faqService.updateFaq(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "FAQ not found" });
    return res.status(200).json({ message: "FAQ updated", data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteFaqHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const removed = await faqService.removeFaq(req.params.id);
    if (!removed) return res.status(404).json({ message: "FAQ not found" });
    return res.status(200).json({ message: "FAQ deleted" });
  } catch (err) {
    next(err);
  }
}

export async function publishFaqHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const published = req.body.published;
    if (typeof published !== "boolean")
      return res.status(400).json({ message: "published must be boolean" });
    const updated = await faqService.setPublishState(req.params.id, published);
    if (!updated) return res.status(404).json({ message: "FAQ not found" });
    return res
      .status(200)
      .json({ message: "Publish state updated", data: updated });
  } catch (err) {
    next(err);
  }
}
