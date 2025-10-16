export type TLogin = {
  email: string;
  password: string;
};
export type TSignup = {
  name: string;
  email: string;
  password: string;
};

export type TResetPassword = {
  otp: string;
  password: string;
};

export type TUploadImage = {
  file: File;
  folder: string;
};

export type TSuperAdmin = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
};

export type TPricing = {
  _id?: string;
  icon: string;
  title: string;
  subTitle: string;
  monthlyPrice: number;
  yearlyPrice: number;
  benefits: string[];
  popular: boolean;
  order: number;
  publish: boolean;
};

export type TUser = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  homeCountry: string;
  yearsOfExperience: number;
  primaryGoal: string;
  medicalBackground?: string;
  agreeToTerms: boolean;
  password?: string;
  subscribeToUpdates: boolean;
  role: "User";
  otp?: string;
  otpExpiry?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TMentorApplication = {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;

  gmcNumber: string;
  specialty: string;
  currentNhsTrust: string;
  currentRole: string;
  clinicalExperienceYears: number;
  nhsExperienceYears: number;

  mentorTier: string;
  bio: string;
  mentorshipAreas: string[];
  hourlyRate: number;

  meetLink: string;
  resume: string;
  gmcCertificate: string;
  medicalcertificate: string;
  photoID: string;
  additionalCertificate: string;
  recordingConsent?: boolean;
  terms: string;
  remarks: string;
  status: "pending" | "rejected" | "approved";
};
