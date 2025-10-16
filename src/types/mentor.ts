// src/types/mentor.ts
export interface IBackground {
  degree?: string;
  institution?: string;
  year?: number;
  description?: string;
  achievements?: string[];
}

export interface INhsDetails {
  trustOrOrganization?: string;
  role?: string;
  medicalSpecialty?: string;
  subspecialty?: string;
  experienceYears?: number;
}

export interface IMentor {
  _id?: string;

  // Basic Info
  name: string;
  specialities: string[];
  rating?: number;
  address?: string;
  location?: string;
  designation?: string;
  department?: string;
  position?: string;

  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  description?: string;
  image?: string | File;
  profilePicture?: string | File;
  // Professional Details
  gmcNumber: string;
  currentNhsTrust: string;
  currentRole: string;
  specialty: string;
  subspecialty?: string;
  clinicalExperienceYears: number;
  nhsExperienceYears: number;
  postgraduateQualifications?: string[];
  teachingRoles?: string[];
  mentorshipExperience?: string;

  // Relationships
  mentees?: string[]; // store ObjectId as string on frontend

  // Background
  background?: IBackground[];

  // NHS-specific
  isNhsMentor?: boolean;
  nhsDetails?: INhsDetails;

  // Mentorship Areas
  mentorshipAreas: string[];

  // Languages
  languagesSpoken: string[];

  // Availability & Format
  availability: string;
  mentorshipFormat: string;
  mentoringApproach?: string;
  successStories?: string;
  handlingDifficultMentees?: string;

  // Compliance
  gmcValid: boolean;
  noFitnessToPracticeIssues: boolean;
  codeOfConductAgreement: boolean;
  qualityReviewConsent: boolean;
  gdprCompliance: boolean;

  // Payment & CPD
  preferredPaymentMethod: string;
  taxInfo?: string;
  cpdParticipation?: boolean;

  // Additional Info
  areasOfInterest?: string[];
  allowPublicProfile: boolean;
  exclusiveMatching?: boolean;
  otherNotes?: string;

  // Document Uploads
  gmcCertificate: string;
  specialtyCertificates?: string[];
  cvDocument?: string;
  indemnityInsurance?: string;

  // Status & Mode
  status: "active" | "inactive" | "away";
  mode: "online" | "onsite" | "hybrid";
  approved: boolean;
}
