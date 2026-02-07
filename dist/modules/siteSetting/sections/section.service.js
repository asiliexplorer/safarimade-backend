"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSections = getAllSections;
exports.getSectionByKey = getSectionByKey;
exports.updateSectionByKey = updateSectionByKey;
exports.replaceSectionByKey = replaceSectionByKey;
exports.deleteSectionByKey = deleteSectionByKey;
// src/modules/siteSetting/sections/section.service.ts
const section_model_1 = require("./section.model");
/**
 * Get all sections
 */
async function getAllSections() {
    return section_model_1.SectionModel.find().sort({ order: 1 }).lean();
}
/**
 * Get section by key
 */
async function getSectionByKey(key) {
    return section_model_1.SectionModel.findOne({ key }).lean();
}
/**
 * PATCH partial update
 */
async function updateSectionByKey(key, payload) {
    const doc = await section_model_1.SectionModel.findOne({ key });
    if (!doc)
        return null;
    // Ensure features exists and is an array before any operations
    if (!Array.isArray(doc.features)) {
        doc.features = [];
    }
    // FULL Replace features
    if (payload.replaceFeatures) {
        doc.features = payload.replaceFeatures;
    }
    // Add a single feature (doc.features guaranteed to be array)
    if (payload.addFeature) {
        doc.features.push(payload.addFeature);
    }
    // Remove by index (safe checks)
    if (typeof payload.removeFeatureAt === "number" &&
        Number.isInteger(payload.removeFeatureAt) &&
        payload.removeFeatureAt >= 0 &&
        payload.removeFeatureAt < doc.features.length) {
        doc.features.splice(payload.removeFeatureAt, 1);
    }
    // Move feature (safe checks and handle index shift)
    if (payload.moveFeature) {
        const { from, to } = payload.moveFeature;
        if (Number.isInteger(from) &&
            Number.isInteger(to) &&
            from >= 0 &&
            from < doc.features.length &&
            to >= 0 &&
            to <= doc.features.length) {
            // remove item
            const [item] = doc.features.splice(from, 1);
            // if removing an earlier index, the target index shifts left by 1
            const insertIndex = from < to ? Math.max(0, to - 1) : to;
            doc.features.splice(insertIndex, 0, item);
        }
    }
    // Update other allowed fields (whitelist)
    const updatable = [
        "title",
        "subtitle",
        "intro",
        "media",
        "stats",
        "order",
    ];
    for (const field of updatable) {
        const k = field;
        // access payload with a safe cast; only set if provided
        const value = payload[k];
        if (value !== undefined) {
            // Mongoose Document typing can be tricky; cast to any for assignment
            doc[k] = value;
        }
    }
    await doc.save();
    return doc.toObject();
}
/**
 * PUT full replace
 */
async function replaceSectionByKey(key, payload) {
    return section_model_1.SectionModel.findOneAndUpdate({ key }, payload, {
        new: true,
        upsert: false,
    }).lean();
}
/**
 * Delete section
 */
async function deleteSectionByKey(key) {
    return section_model_1.SectionModel.findOneAndDelete({ key });
}
