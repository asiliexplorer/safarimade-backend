"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTravelProposalHandler = createTravelProposalHandler;
exports.listTravelProposalsHandler = listTravelProposalsHandler;
const travelProposal_service_1 = require("./travelProposal.service");
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
async function createTravelProposalHandler(req, res, next) {
    try {
        const payload = req.body;
        const normalizedWhatsapp = String(payload.whatsapp || payload.wattsapp || "").trim();
        const normalizedPayload = {
            ...payload,
            whatsapp: normalizedWhatsapp || undefined,
            wattsapp: normalizedWhatsapp || undefined,
        };
        console.log("[TravelProposal][Backend] POST hit:", req.method, req.originalUrl);
        console.log("[TravelProposal][Backend] received body:", normalizedPayload);
        if (!normalizedPayload.firstName?.trim()) {
            return res.status(400).json({ success: false, message: "First name is required" });
        }
        if (!normalizedPayload.lastName?.trim()) {
            return res.status(400).json({ success: false, message: "Last name is required" });
        }
        if (!normalizedPayload.email?.trim() || !isValidEmail(normalizedPayload.email)) {
            return res.status(400).json({ success: false, message: "Valid email is required" });
        }
        if (!normalizedPayload.phone?.trim()) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }
        if (!normalizedPayload.destinationKnowledge?.trim()) {
            return res.status(400).json({ success: false, message: "Destination knowledge is required" });
        }
        if (!Array.isArray(normalizedPayload.reasons) || normalizedPayload.reasons.length === 0) {
            return res.status(400).json({ success: false, message: "At least one travel reason is required" });
        }
        if (!normalizedPayload.arrivalDate?.trim()) {
            return res.status(400).json({ success: false, message: "Arrival date is required" });
        }
        if (!normalizedPayload.travelWith?.trim()) {
            return res.status(400).json({ success: false, message: "Travel companion info is required" });
        }
        const created = await (0, travelProposal_service_1.createTravelProposal)(normalizedPayload);
        console.log("[TravelProposal][Backend] saved document:", created);
        return res.status(201).json({ success: true, message: "Travel proposal saved", data: created });
    }
    catch (err) {
        next(err);
    }
}
async function listTravelProposalsHandler(req, res, next) {
    try {
        const data = await (0, travelProposal_service_1.listTravelProposals)();
        const normalized = data.map((proposal) => {
            const whatsapp = String(proposal.whatsapp || proposal.wattsapp || "").trim();
            return {
                ...proposal,
                whatsapp,
                wattsapp: whatsapp,
            };
        });
        return res.status(200).json({ success: true, data: normalized });
    }
    catch (err) {
        next(err);
    }
}
