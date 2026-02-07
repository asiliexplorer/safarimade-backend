"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFaqs = listFaqs;
exports.getFaqById = getFaqById;
exports.createFaq = createFaq;
exports.updateFaq = updateFaq;
exports.removeFaq = removeFaq;
exports.setPublishState = setPublishState;
// modules/faq/faq.service.ts
const faq_model_1 = __importDefault(require("./faq.model"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Public list with search + pagination
 */
async function listFaqs(options) {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 20));
    const skip = (page - 1) * limit;
    const filter = {};
    if (options.q) {
        // text search on question & answer
        const q = options.q.trim();
        filter.$or = [
            { question: new RegExp(escapeRegExp(q), "i") },
            { answer: new RegExp(escapeRegExp(q), "i") },
        ];
    }
    if (typeof options.published === "boolean")
        filter.published = options.published;
    if (options.category)
        filter.category = options.category;
    if (options.tags && options.tags.length)
        filter.tags = { $in: options.tags };
    // simple sort parsing
    let sort = { order: 1, createdAt: -1 };
    if (options.sort) {
        sort = {};
        options.sort.split(",").forEach((s) => {
            const [k, dir] = s.split(":").map((x) => x.trim());
            sort[k] = dir === "desc" || dir === "-1" ? -1 : 1;
        });
    }
    const [items, total] = await Promise.all([
        faq_model_1.default.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        faq_model_1.default.countDocuments(filter),
    ]);
    return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    };
}
/** Get single FAQ */
async function getFaqById(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return faq_model_1.default.findById(id).lean();
}
/** Create */
async function createFaq(payload) {
    const doc = new faq_model_1.default(payload);
    await doc.save();
    return doc.toObject();
}
/** Update */
async function updateFaq(id, payload) {
    const updated = await faq_model_1.default.findByIdAndUpdate(id, { $set: payload }, { new: true }).lean();
    return updated;
}
/** Delete */
async function removeFaq(id) {
    return faq_model_1.default.findByIdAndDelete(id).lean();
}
/** Toggle publish flag */
async function setPublishState(id, published) {
    return faq_model_1.default.findByIdAndUpdate(id, { $set: { published } }, { new: true }).lean();
}
/** Helper */
function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
