import { Request, Response } from "express";
import * as packageService from "./package.service";

export async function createPackage(req: Request, res: Response) {
  const payload = {
    ...req.body,
    createdByAdmin: true,
  };
  console.log("[PackageController] createPackage payload:", payload);
  const created = await packageService.createPackage(payload);
  res.status(201).json({ success: true, data: created });
}

export async function listPackages(req: Request, res: Response) {
  const { page, limit, search, category, isActive, createdByAdmin, sortBy, sortOrder } = req.query;

  const data = await packageService.listPackages({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search: typeof search === "string" ? search : undefined,
    category: typeof category === "string" ? category : undefined,
    isActive: typeof isActive === "string" ? isActive : undefined,
    createdByAdmin: typeof createdByAdmin === "string" ? createdByAdmin : undefined,
    sortBy: typeof sortBy === "string" ? sortBy : undefined,
    sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
  });

  res.json({ success: true, data });
}

export async function getPackage(req: Request, res: Response) {
  const data = await packageService.getPackageById(req.params.id);
  if (!data) {
    return res.status(404).json({ success: false, message: "Package not found" });
  }

  res.json({ success: true, data });
}

export async function patchPackage(req: Request, res: Response) {
  const updated = await packageService.updatePackageById(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Package not found" });
  }

  res.json({ success: true, data: updated });
}

export async function removePackage(req: Request, res: Response) {
  const deleted = await packageService.deletePackageById(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Package not found" });
  }

  res.json({ success: true, message: "Package deleted" });
}
