// modules/footer/footer.service.ts
import FooterModel from "./footer.model";
import { IFooter } from "./footer.types";

export async function getFooter(): Promise<IFooter | null> {
  const doc = await FooterModel.findOne().lean();
  return doc as IFooter | null;
}

export async function upsertFooter(
  payload: Partial<IFooter>
): Promise<IFooter> {
  const updated = await FooterModel.findOneAndUpdate(
    {},
    { $set: { ...payload, updatedAt: new Date() } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
  return updated as IFooter;
}
