// modules/contact/contact.controller.ts
import { Request, Response, NextFunction } from "express";
import * as contactService from "./contact.service";
export async function getContactHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const contact = await contactService.getContact();
    if (!contact) {
      return res.status(200).json({
        message: "No contact found",
        data: {
          heading: "Contact Us",
          subtitle: "OUR SPECIALISTS ARE HERE TO ASSIST YOU",
          phones: {},
          email: "",
          address: "",
          specialists: [],
        },
      });
    }
    return res.status(200).json({ data: contact });
  } catch (err) {
    next(err);
  }
}

export async function updateContactHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = req.body;

    if (payload.specialists && !Array.isArray(payload.specialists)) {
      return res.status(400).json({ message: "specialists must be an array" });
    }

    const updated = await contactService.upsertContact(payload);
    return res.status(200).json({ message: "Contact updated", data: updated });
  } catch (err) {
    next(err);
  }
}
