// modules/contact/contact.service.ts

import ContactModel from "./contact.model";
import { IContact } from "./contact.types";

 
export async function getContact(): Promise<IContact | null> {
  const doc = await ContactModel.findOne().lean();
  return doc as IContact | null;
}

/**
 * Create or update the singleton contact document.
 * Accepts a partial IContact payload.
 */
export async function upsertContact(
  payload: Partial<IContact>
): Promise<IContact> {
  const updated = await ContactModel.findOneAndUpdate(
    {},
    { $set: { ...payload, updatedAt: new Date() } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
  return updated as IContact;
}
