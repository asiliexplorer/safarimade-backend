"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// modules/faq/faq.routes.ts
const express_1 = __importDefault(require("express"));
const faq_controller_1 = require("./faq.controller");
// import { requireAuth } from "../../common/middleware/auth"; // protect admin routes
const router = express_1.default.Router();
/**
 * @openapi
 * components:
 *   schemas:
 *     Faq:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         question: { type: string }
 *         answer: { type: string }
 *         category: { type: string }
 *         tags:
 *           type: array
 *           items: { type: string }
 *         order: { type: integer }
 *         published: { type: boolean }
 *         image: { type: string }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *       required: [question, answer]
 *
 * tags:
 *   - name: FAQ
 *     description: Frequently Asked Questions (public list + admin CRUD)
 */
/**
 * @openapi
 * /api/faqs:
 *   get:
 *     summary: List FAQ items (public). Supports search, filter, pagination.
 *     tags: [FAQ]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Full-text query on question and answer
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *         description: Comma-separated tags to match (any)
 *       - in: query
 *         name: published
 *         schema: { type: boolean }
 *         description: Only published items (true/false)
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: Sort string, e.g. "order:asc,createdAt:desc"
 *     responses:
 *       "200":
 *         description: paged result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Faq'
 *                 total: { type: integer }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 pages: { type: integer }
 */
router.get("/", faq_controller_1.listFaqsHandler);
/**
 * @openapi
 * /api/faqs/{id}:
 *   get:
 *     summary: Get a single FAQ by id
 *     tags: [FAQ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       "200": { description: "FAQ item", content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Faq' } } } } } }
 *       "404": { description: "Not found" }
 */
router.get("/:id", faq_controller_1.getFaqHandler);
/**
 * @openapi
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ (admin)
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faq'
 *     responses:
 *       "201": { description: "Created" }
 *       "400": { description: "Validation error" }
 */
router.post("/", /* requireAuth, */ faq_controller_1.createFaqHandler);
/**
 * @openapi
 * /api/faqs/{id}:
 *   put:
 *     summary: Update an FAQ (admin)
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faq'
 *     responses:
 *       "200": { description: "Updated" }
 *       "404": { description: "Not found" }
 */
router.put("/:id", /* requireAuth, */ faq_controller_1.updateFaqHandler);
/**
 * @openapi
 * /api/faqs/{id}:
 *   delete:
 *     summary: Delete an FAQ (admin)
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       "200": { description: "Deleted" }
 *       "404": { description: "Not found" }
 */
router.delete("/:id", /* requireAuth, */ faq_controller_1.deleteFaqHandler);
/**
 * @openapi
 * /api/faqs/{id}/publish:
 *   patch:
 *     summary: Set publish state (admin)
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               published:
 *                 type: boolean
 *     responses:
 *       "200": { description: "Publish state updated" }
 */
router.patch("/:id/publish", /* requireAuth, */ faq_controller_1.publishFaqHandler);
exports.default = router;
