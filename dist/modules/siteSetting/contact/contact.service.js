"use strict";
// modules/contact/contact.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContact = getContact;
exports.upsertContact = upsertContact;
const contact_model_1 = __importDefault(require("./contact.model"));
async function getContact() {
    const doc = await contact_model_1.default.findOne().lean();
    return doc;
}
/**
 * Create or update the singleton contact document.
 * Accepts a partial IContact payload.
 */
async function upsertContact(payload) {
    const updated = await contact_model_1.default.findOneAndUpdate({}, { $set: { ...payload, updatedAt: new Date() } }, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
    return updated;
}
