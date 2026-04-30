"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const cloudinary_1 = require("../../config/cloudinary");
function uploadBufferToCloudinary(file, folder = "packages") {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.cloudinary.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error || !result) {
                reject(error || new Error("Upload failed"));
                return;
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            });
        });
        stream.end(file.buffer);
    });
}
