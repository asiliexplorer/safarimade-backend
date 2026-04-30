import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../../common/middleware/authMiddleware";
import { roleMiddleware } from "../../common/middleware/roleMiddleware";
import { uploadImages } from "./upload.controller";
import { deleteImages } from "./delete.controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
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

router.post("/images", authMiddleware, roleMiddleware("admin"), upload.array("images", 20), uploadImages);

router.post("/images/delete", authMiddleware, roleMiddleware("admin"), deleteImages);

export default router;
