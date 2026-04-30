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
exports.createPackage = createPackage;
exports.listPackages = listPackages;
exports.getPackage = getPackage;
exports.getPackageBySlug = getPackageBySlug;
exports.patchPackage = patchPackage;
exports.removePackage = removePackage;
const packageService = __importStar(require("./package.service"));
async function createPackage(req, res) {
    const payload = { ...req.body };
    console.log("[PackageController] createPackage payload:", payload);
    const created = await packageService.createPackage(payload);
    res.status(201).json({ success: true, data: created });
}
async function listPackages(req, res) {
    const { page, limit, search, category, isActive, sortBy, sortOrder } = req.query;
    const data = await packageService.listPackages({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: typeof search === "string" ? search : undefined,
        category: typeof category === "string" ? category : undefined,
        isActive: typeof isActive === "string" ? isActive : undefined,
        sortBy: typeof sortBy === "string" ? sortBy : undefined,
        sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
    });
    res.json({ success: true, data });
}
async function getPackage(req, res) {
    const data = await packageService.getPackageById(req.params.id);
    if (!data) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data });
}
async function getPackageBySlug(req, res) {
    const data = await packageService.getPackageBySlug(req.params.slug);
    if (!data) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data });
}
async function patchPackage(req, res) {
    const updated = await packageService.updatePackageById(req.params.id, req.body);
    if (!updated) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data: updated });
}
async function removePackage(req, res) {
    const deleted = await packageService.deletePackageById(req.params.id);
    if (!deleted) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, message: "Package deleted" });
}
