import { Request, Response } from "express";
import * as sectionService from "./section.service";

/**
 * GET /api/sections
 */
export async function listSections(req: Request, res: Response) {
  const data = await sectionService.getAllSections();
  res.json({ success: true, data });
}

/**
 * GET /api/sections/:key
 */
export async function getSection(req: Request, res: Response) {
  const key = req.params.key;
  const data = await sectionService.getSectionByKey(key);
  if (!data) {
    return res.status(404).json({ success: false, message: "Not found" });
  }
  res.json({ success: true, data });
}

/**
 * PATCH /api/sections/:key  (partial update)
 */
export async function patchSection(req: Request, res: Response) {
  const key = req.params.key;
  const updated = await sectionService.updateSectionByKey(key, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  res.json({ success: true, data: updated });
}

/**
 * PUT /api/sections/:key  (full replace)
 */
export async function putSection(req: Request, res: Response) {
  const key = req.params.key;
  const updated = await sectionService.replaceSectionByKey(key, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  res.json({ success: true, data: updated });
}

/**
 * DELETE /api/sections/:key
 */
export async function removeSection(req: Request, res: Response) {
  const key = req.params.key;
  await sectionService.deleteSectionByKey(key);
  res.json({ success: true, message: "Deleted" });
}
