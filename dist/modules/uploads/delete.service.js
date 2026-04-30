"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicIdFromUrl = extractPublicIdFromUrl;
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
const cloudinary_1 = require("../../config/cloudinary");
function extractPublicIdFromUrl(url) {
    try {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/);
        return match ? match[1] : "";
    }
    catch (error) {
        console.error("Error extracting public ID:", error);
        return "";
    }
}
function deleteImageFromCloudinary(url) {
    return new Promise((resolve, reject) => {
        const publicId = extractPublicIdFromUrl(url);
        if (!publicId) {
            console.warn("Could not extract public ID from URL:", url);
            resolve();
            return;
        }
        cloudinary_1.cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.warn("Cloudinary delete error for", publicId, ":", error);
                resolve();
                return;
            }
            resolve();
        });
    });
}
