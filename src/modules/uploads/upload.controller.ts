import { Request, Response, NextFunction } from "express";
import { hasCloudinaryCredentials } from "../../config/cloudinary";
import { uploadBufferToCloudinary } from "./upload.service";

export async function uploadImages(req: Request, res: Response, next: NextFunction) {
  try {
    if (!hasCloudinaryCredentials) {
      res.status(500).json({
        success: false,
        message: "Cloudinary is not configured on the server",
      });
      return;
    }

    const files = (req.files as Express.Multer.File[] | undefined) || [];

    if (!files.length) {
      res.status(400).json({ success: false, message: "No image files were uploaded" });
      return;
    }

    const uploaded = await Promise.all(files.map((file) => uploadBufferToCloudinary(file, "packages")));

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: {
        files: uploaded,
        urls: uploaded.map((item) => item.url),
      },
    });
  } catch (error) {
    next(error);
  }
}
