"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/siteSetting/reviews/review.routes.ts
const express_1 = require("express");
const ctrl = __importStar(require("./review.controller"));
const authMiddleware_1 = require("../../../common/middleware/authMiddleware");
const roleMiddleware_1 = require("../../../common/middleware/roleMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Customer reviews / testimonials (public read, admin CRUD)
 *
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         author:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         date:
 *           type: string
 *           format: date
 *         source:
 *           type: string
 *         enabled:
 *           type: boolean
 *         featured:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ReviewCreate:
 *       type: object
 *       required:
 *         - author
 *         - content
 *         - rating
 *       properties:
 *         author:
 *           type: string
 *         content:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         avatarUrl:
 *           type: string
 *         title:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         source:
 *           type: string
 *         enabled:
 *           type: boolean
 *         featured:
 *           type: boolean
 */
/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Public - list reviews
 *     description: |
 *       Returns list of reviews.
 *       Query params supported: enabled, featured, limit, skip, sort.
 *     parameters:
 *       - in: query
 *         name: enabled
 *         schema:
 *           type: boolean
 *         description: Filter by enabled status
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured flag
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Max items to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Offset
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Mongoose sort string, e.g. -featured,-date
 *     responses:
 *       200:
 *         description: list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 */
router.get("/", ctrl.listReviews);
/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Public - get single review by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: review object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: not found
 */
router.get("/:id", ctrl.getReview);
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Admin - create a review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewCreate'
 *     responses:
 *       201:
 *         description: created
 *       400:
 *         description: validation error
 */
router.post("/", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), ctrl.createReview);
/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Admin - update partial fields of a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: fields to update (author, content, rating, enabled, featured, ...)
 *     responses:
 *       200:
 *         description: updated
 *       404:
 *         description: not found
 */
router.patch("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), ctrl.patchReview);
/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Admin - delete a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: deleted
 *       404:
 *         description: not found
 */
router.delete("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), ctrl.removeReview);
/**
 * @swagger
 * /api/reviews/{id}/enable:
 *   patch:
 *     tags: [Reviews]
 *     summary: Admin - enable or disable a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: updated
 *       404:
 *         description: not found
 */
router.patch("/:id/enable", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), ctrl.toggleEnabled);
exports.default = router;
