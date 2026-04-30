"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = deleteImages;
const delete_service_1 = require("./delete.service");
async function deleteImages(req, res, next) {
    try {
        const { urls } = req.body;
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            res.status(400).json({ success: false, message: "No URLs provided for deletion" });
            return;
        }
        const results = await Promise.allSettled(urls.map((url) => (0, delete_service_1.deleteImageFromCloudinary)(url)));
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
    }
    catch (error) {
        next(error);
    }
}
