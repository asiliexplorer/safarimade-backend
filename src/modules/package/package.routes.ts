import { Router } from "express";
import * as ctrl from "./package.controller";
import { authMiddleware } from "../../common/middleware/authMiddleware";
import { roleMiddleware } from "../../common/middleware/roleMiddleware";

const router = Router();

router.get("/", ctrl.listPackages);
router.get("/slug/:slug", ctrl.getPackageBySlug);
router.get("/:id", ctrl.getPackage);

router.post("/", authMiddleware, roleMiddleware("admin"), ctrl.createPackage);
router.patch("/:id", authMiddleware, roleMiddleware("admin"), ctrl.patchPackage);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), ctrl.removePackage);

export default router;
