"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.hasCloudinaryCredentials = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
exports.hasCloudinaryCredentials = Boolean(cloudName && apiKey && apiSecret);
if (exports.hasCloudinaryCredentials) {
    cloudinary_1.v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
}
