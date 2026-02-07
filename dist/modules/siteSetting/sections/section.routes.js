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
const express_1 = require("express");
const ctrl = __importStar(require("./section.controller"));
const authMiddleware_1 = require("../../../common/middleware/authMiddleware");
const roleMiddleware_1 = require("../../../common/middleware/roleMiddleware");
const router = (0, express_1.Router)();
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
router.patch("/:key", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), ctrl.patchSection);
/**
 * @swagger
 * /api/sections/{key}:
 *   put:
 *     tags: [Sections]
 *     summary: Fully replace a section (admin)
 */
router.put("/:key", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), ctrl.putSection);
/**
 * @swagger
 * /api/sections/{key}:
 *   delete:
 *     tags: [Sections]
 *     summary: Delete a section (admin)
 */
router.delete("/:key", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)("admin"), ctrl.removeSection);
exports.default = router;
