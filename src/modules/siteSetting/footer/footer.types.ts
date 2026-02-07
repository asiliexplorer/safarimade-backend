// modules/footer/footer.types.ts
import { Document } from "mongoose";

export interface IGalleryItem {
  _id?: string;
  src: string;
  alt?: string;
  order?: number;
}

export interface IFooterLink {
  _id?: string;
  label: string;
  href: string;
  order?: number;
}

export interface ISocial {
  _id?: string;
  provider: string; // e.g. "facebook", "instagram"
  url: string;
  order?: number;
}

export interface IFooter {
  logoUrl?: string;
  phone?: string;
  copyright?: string;
  quickLinks?: IFooterLink[]; // left column's links
  itineraries?: IFooterLink[]; // second column
  travelInfo?: IFooterLink[]; // third column
  newsletter?: {
    title?: string;
    subtitle?: string;
    placeholderName?: string;
    placeholderEmail?: string;
    signupText?: string;
  };
  gallery?: IGalleryItem[];
  social?: ISocial[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFooterDocument extends IFooter, Document {}
