import { Request, Response, NextFunction } from "express";
import { deleteImageFromCloudinary } from "./delete.service";

export async function deleteImages(req: Request, res: Response, next: NextFunction) {
  try {
    const { urls } = req.body as { urls?: string[] };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({ success: false, message: "No URLs provided for deletion" });
      return;
    }

    const results = await Promise.allSettled(
      urls.map((url) => deleteImageFromCloudinary(url))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    res.status(200).json({
      success: true,
      message: `Deleted ${succeeded} image(s)${failed > 0 ? ` (${failed} failed)` : ""}`,
      data: {
        totalRequested: urls.length,
        succeeded,
        failed,
      },
    });
  } catch (error) {
    next(error);
  }
}
