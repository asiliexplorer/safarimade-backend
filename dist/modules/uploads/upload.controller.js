"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = uploadImages;
const cloudinary_1 = require("../../config/cloudinary");
const upload_service_1 = require("./upload.service");
async function uploadImages(req, res, next) {
    try {
        if (!cloudinary_1.hasCloudinaryCredentials) {
            res.status(500).json({
                success: false,
                message: "Cloudinary is not configured on the server",
            });
            return;
        }
        const files = req.files || [];
        if (!files.length) {
            res.status(400).json({ success: false, message: "No image files were uploaded" });
            return;
        }
        const uploaded = await Promise.all(files.map((file) => (0, upload_service_1.uploadBufferToCloudinary)(file, "packages")));
        res.status(201).json({
            success: true,
            message: "Images uploaded successfully",
            data: {
                files: uploaded,
                urls: uploaded.map((item) => item.url),
            },
        });
    }
    catch (error) {
        next(error);
    }
}
