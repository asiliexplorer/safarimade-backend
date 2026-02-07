"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFooter = getFooter;
exports.upsertFooter = upsertFooter;
// modules/footer/footer.service.ts
const footer_model_1 = __importDefault(require("./footer.model"));
async function getFooter() {
    const doc = await footer_model_1.default.findOne().lean();
    return doc;
}
async function upsertFooter(payload) {
    const updated = await footer_model_1.default.findOneAndUpdate({}, { $set: { ...payload, updatedAt: new Date() } }, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
    return updated;
}
