import TravelProposalModel from "./travelProposal.model";
import { ITravelProposal } from "./travelProposal.types";

export async function createTravelProposal(
  payload: ITravelProposal
): Promise<ITravelProposal> {
  const created = await TravelProposalModel.create(payload);
  return created.toObject() as ITravelProposal;
}

export async function listTravelProposals(): Promise<ITravelProposal[]> {
  const docs = await TravelProposalModel.find()
    .sort({ createdAt: -1 })
    .lean<ITravelProposal[]>();
  return docs;
}
