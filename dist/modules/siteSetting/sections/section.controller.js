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
exports.listSections = listSections;
exports.getSection = getSection;
exports.patchSection = patchSection;
exports.putSection = putSection;
exports.removeSection = removeSection;
const sectionService = __importStar(require("./section.service"));
/**
 * GET /api/sections
 */
async function listSections(req, res) {
    const data = await sectionService.getAllSections();
    res.json({ success: true, data });
}
/**
 * GET /api/sections/:key
 */
async function getSection(req, res) {
    const key = req.params.key;
    const data = await sectionService.getSectionByKey(key);
    if (!data) {
        return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data });
}
/**
 * PATCH /api/sections/:key  (partial update)
 */
async function patchSection(req, res) {
    const key = req.params.key;
    const updated = await sectionService.updateSectionByKey(key, req.body);
    if (!updated) {
        return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: updated });
}
/**
 * PUT /api/sections/:key  (full replace)
 */
async function putSection(req, res) {
    const key = req.params.key;
    const updated = await sectionService.replaceSectionByKey(key, req.body);
    if (!updated) {
        return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: updated });
}
/**
 * DELETE /api/sections/:key
 */
async function removeSection(req, res) {
    const key = req.params.key;
    await sectionService.deleteSectionByKey(key);
    res.json({ success: true, message: "Deleted" });
}
