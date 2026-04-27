import { NextFunction, Request, Response } from "express";
import { createTravelProposal, listTravelProposals } from "./travelProposal.service";
import { ITravelProposal } from "./travelProposal.types";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createTravelProposalHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = req.body as ITravelProposal;
    const normalizedWhatsapp = String(payload.whatsapp || payload.wattsapp || "").trim();
    const normalizedPayload: ITravelProposal = {
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

    const created = await createTravelProposal(normalizedPayload);
    console.log("[TravelProposal][Backend] saved document:", created);
    return res.status(201).json({ success: true, message: "Travel proposal saved", data: created });
  } catch (err) {
    next(err);
  }
}

export async function listTravelProposalsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await listTravelProposals();
    const normalized = data.map((proposal) => {
      const whatsapp = String((proposal as any).whatsapp || (proposal as any).wattsapp || "").trim();
      return {
        ...proposal,
        whatsapp,
        wattsapp: whatsapp,
      };
    });
    return res.status(200).json({ success: true, data: normalized });
  } catch (err) {
    next(err);
  }
}
