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
exports.listFaqsHandler = listFaqsHandler;
exports.getFaqHandler = getFaqHandler;
exports.createFaqHandler = createFaqHandler;
exports.updateFaqHandler = updateFaqHandler;
exports.deleteFaqHandler = deleteFaqHandler;
exports.publishFaqHandler = publishFaqHandler;
const faqService = __importStar(require("./faq.service"));
async function listFaqsHandler(req, res, next) {
    try {
        const { q, category, tags, published, page, limit, sort } = req.query;
        const opts = {
            q: typeof q === "string" ? q : undefined,
            category: typeof category === "string" ? category : undefined,
            tags: typeof tags === "string"
                ? tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : undefined,
            published: typeof published === "string" ? published === "true" : undefined,
            page: page ? parseInt(String(page), 10) : undefined,
            limit: limit ? parseInt(String(limit), 10) : undefined,
            sort: typeof sort === "string" ? sort : undefined,
        };
        const result = await faqService.listFaqs(opts);
        return res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function getFaqHandler(req, res, next) {
    try {
        const faq = await faqService.getFaqById(req.params.id);
        if (!faq)
            return res.status(404).json({ message: "FAQ not found" });
        return res.status(200).json({ data: faq });
    }
    catch (err) {
        next(err);
    }
}
async function createFaqHandler(req, res, next) {
    try {
        const payload = req.body;
        if (!payload.question || !payload.answer)
            return res
                .status(400)
                .json({ message: "question and answer are required" });
        const created = await faqService.createFaq(payload);
        return res.status(201).json({ message: "FAQ created", data: created });
    }
    catch (err) {
        next(err);
    }
}
async function updateFaqHandler(req, res, next) {
    try {
        const updated = await faqService.updateFaq(req.params.id, req.body);
        if (!updated)
            return res.status(404).json({ message: "FAQ not found" });
        return res.status(200).json({ message: "FAQ updated", data: updated });
    }
    catch (err) {
        next(err);
    }
}
async function deleteFaqHandler(req, res, next) {
    try {
        const removed = await faqService.removeFaq(req.params.id);
        if (!removed)
            return res.status(404).json({ message: "FAQ not found" });
        return res.status(200).json({ message: "FAQ deleted" });
    }
    catch (err) {
        next(err);
    }
}
async function publishFaqHandler(req, res, next) {
    try {
        const published = req.body.published;
        if (typeof published !== "boolean")
            return res.status(400).json({ message: "published must be boolean" });
        const updated = await faqService.setPublishState(req.params.id, published);
        if (!updated)
            return res.status(404).json({ message: "FAQ not found" });
        return res
            .status(200)
            .json({ message: "Publish state updated", data: updated });
    }
    catch (err) {
        next(err);
    }
}
