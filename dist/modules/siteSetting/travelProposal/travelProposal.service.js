"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTravelProposal = createTravelProposal;
exports.listTravelProposals = listTravelProposals;
const travelProposal_model_1 = __importDefault(require("./travelProposal.model"));
async function createTravelProposal(payload) {
    const created = await travelProposal_model_1.default.create(payload);
    return created.toObject();
}
async function listTravelProposals() {
    const docs = await travelProposal_model_1.default.find()
        .sort({ createdAt: -1 })
        .lean();
    return docs;
}
