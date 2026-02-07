// modules/contact/contact.types.ts
import { Document } from "mongoose";

export interface ISpecialist {
  _id?: string;
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  bio?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContact {
  heading?: string;
  subtitle?: string;
  phones?: {
    usa?: string;
    uk?: string;
    other?: string;
  };
  email?: string;
  address?: string;
  specialists?: ISpecialist[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Document type
export interface IContactDocument extends IContact, Document {}
