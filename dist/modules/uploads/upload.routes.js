"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = require("../../common/middleware/authMiddleware");
const roleMiddleware_1 = require("../../common/middleware/roleMiddleware");
const upload_controller_1 = require("./upload.controller");
const delete_controller_1 = require("./delete.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024,
        files: 20,
    },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
            callback(new Error("Only image files are allowed"));
            return;
        }
        callback(null, true);
    },
});
router.post("/images", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), upload.array("images", 20), upload_controller_1.uploadImages);
router.post("/images/delete", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), delete_controller_1.deleteImages);
exports.default = router;
