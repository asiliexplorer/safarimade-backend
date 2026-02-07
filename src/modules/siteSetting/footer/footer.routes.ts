// modules/footer/footer.routes.ts
import express from "express";
import { getFooterHandler, updateFooterHandler } from "./footer.controller";
import { authMiddleware } from "../../../common/middleware/authMiddleware";
import { roleMiddleware } from "../../../common/middleware/roleMiddleware";
// import { requireAuth } from "../../common/middleware/auth"; // protect PUT if needed

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     FooterLink:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         label: { type: string }
 *         href: { type: string }
 *         order: { type: integer }
 *       required: [label, href]
 *
 *     GalleryItem:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         src: { type: string }
 *         alt: { type: string }
 *         order: { type: integer }
 *       required: [src]
 *
 *     Social:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         provider: { type: string }
 *         url: { type: string }
 *         order: { type: integer }
 *       required: [provider, url]
 *
 *     NewsletterInfo:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         subtitle: { type: string }
 *         placeholderName: { type: string }
 *         placeholderEmail: { type: string }
 *         signupText: { type: string }
 *
 *     Footer:
 *       type: object
 *       properties:
 *         logoUrl: { type: string }
 *         phone: { type: string }
 *         copyright: { type: string }
 *         quickLinks:
 *           type: array
 *           items: { $ref: '#/components/schemas/FooterLink' }
 *         itineraries:
 *           type: array
 *           items: { $ref: '#/components/schemas/FooterLink' }
 *         travelInfo:
 *           type: array
 *           items: { $ref: '#/components/schemas/FooterLink' }
 *         newsletter:
 *           $ref: '#/components/schemas/NewsletterInfo'
 *         gallery:
 *           type: array
 *           items: { $ref: '#/components/schemas/GalleryItem' }
 *         social:
 *           type: array
 *           items: { $ref: '#/components/schemas/Social' }
 *
 * tags:
 *   - name: Footer
 *     description: Site footer (singleton) — GET public, PUT update (admin)
 */

/**
 * @openapi
 * /api/footer:
 *   get:
 *     summary: Get footer information
 *     tags: [Footer]
 *     responses:
 *       "200":
 *         description: Footer document (or defaults)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Footer'
 */
router.get("/", getFooterHandler);

/**
 * @openapi
 * /api/footer:
 *   put:
 *     summary: Create or update footer (singleton)
 *     tags: [Footer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Footer'
 *     responses:
 *       "200":
 *         description: Footer updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Footer'
 *       "400": { description: "Validation error" }
 *       "401": { description: "Unauthorized" }
 */
router.put("/", authMiddleware, roleMiddleware("admin"), updateFooterHandler);

export default router;
