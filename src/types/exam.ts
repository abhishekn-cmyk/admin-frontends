export interface TimelinePhase {
  phase: string;
  weeks?: string;
  details?: string;
}

export interface ExamComponent {
  name: string;
  type?: string;
  details: string[];
}

export interface Mentorship {
  included: boolean;
  type: "1:1" | "group" | "principal";
  sessions: number;
}

export interface ExamAction {
  label: string;
  type: "enroll" | "download" | "consultation" | "purchase";
  link: string;
}

export interface PricingOption {
  label: string;
  price: number;
}

export interface Exam {
  _id?: string;
  enrolledUsers?: number;
  category: "English Proficiency" | "PLAB" | "Postgraduate";
  subcategory?: string;
  title: string;
  subtitle?: string;
  description: string;
  features: string[];
  includes?: string[];
  mentors?: string[];
  timeline?: TimelinePhase[];
  components?: ExamComponent[];
  mentorship?: Mentorship;
  price?: number;
  currency?: string;
  pricingOptions?: PricingOption[];
  paymentLink?: string;
  examType?: "IELTS" | "OET" | "PLAB-1" | "MRCP" | "MRCS" | "MRCOG" | "MRCPCH";
  bundleItems?: string[];
  actions?: ExamAction[];
  startDate?: string | Date;
  endDate?: string | Date;
  duration?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
