import { Router } from "express";
import * as ctrl from "./section.controller";
import { authMiddleware } from "../../../common/middleware/authMiddleware";
import { roleMiddleware } from "../../../common/middleware/roleMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Sections
 *     description: CMS editable sections (GET public, UPDATE protected)
 */

/**
 * @swagger
 * /api/sections:
 *   get:
 *     tags: [Sections]
 *     summary: Get all sections (public)
 */
router.get("/", ctrl.listSections);

/**
 * @swagger
 * /api/sections/{key}:
 *   get:
 *     tags: [Sections]
 *     summary: Get section by key (public)
 */
router.get("/:key", ctrl.getSection);

/**
 * @swagger
 * /api/sections/{key}:
 *   patch:
 *     tags: [Sections]
 *     summary: Partially update a section (admin)
 */
router.patch(
  "/:key",
  authMiddleware,
  roleMiddleware("admin"),
  ctrl.patchSection
);

/**
 * @swagger
 * /api/sections/{key}:
 *   put:
 *     tags: [Sections]
 *     summary: Fully replace a section (admin)
 */
router.put("/:key", authMiddleware, roleMiddleware("admin"), ctrl.putSection);

/**
 * @swagger
 * /api/sections/{key}:
 *   delete:
 *     tags: [Sections]
 *     summary: Delete a section (admin)
 */
router.delete(
  "/:key",
  authMiddleware,
  roleMiddleware("admin"),
  ctrl.removeSection
);

export default router;
