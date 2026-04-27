import { Document } from "mongoose";

export interface ITravelProposal {
  destinationKnowledge: string;
  destination?: string;
  reasons: string[];
  tripDuration: number;
  arrivalDate: string;
  travelWith: string;
  adults: number;
  children: number;
  budget: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  wattsapp?: string;
  country: string;
  notes?: string;
  newsletter: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITravelProposalDocument extends ITravelProposal, Document {}
