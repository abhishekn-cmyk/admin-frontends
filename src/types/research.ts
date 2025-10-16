export interface IPublication {
  _id?: string;
  title: string;
  authors: string[];
  date: string;
  summary: string;
  category: string;
}

export interface IFocusArea {
  _id?: string;
  title: string;
  description?: string;
}

export interface IPartnership {
  _id?: string;
  partnerName: string;
  description?: string;
}

export interface IParticipation {
  _id?: string;
  name: string;
  role?: string;
  date?: string;
}

export interface IProposal {
  _id?: string;
  title: string;
  description?: string;
  date?: string;
}

export interface ICounts {
  publications: number;
  focusAreas: number;
  partnerships: number;
  participations: number;
  proposals: number;
}

export type SectionType =
  | "publication"
  | "focus"
  | "partnership"
  | "participation"
  | "proposal";

