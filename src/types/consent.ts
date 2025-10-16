// src/types/consent.ts
export type ConsentChoice = "accept_all" | "essential_only" | "decline";

export interface IConsent {
  _id?: string;
  userId?: string;            // optional if public
  choice: ConsentChoice;
  acceptedAt?: string;        // ISO date
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;

  // Add policy field
  policy?: {
    version: string;
    title: string;
    description: string;
    sections: {
      heading: string;
      content: string;
    }[];
  };
}
