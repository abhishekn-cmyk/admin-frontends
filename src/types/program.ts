export interface IPricingOption {
  name: string;
  price: number;
  type: "cpd" | "mentorship" | "bundle";
}

export interface IProgram {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  category: "CPD" | "Mentorship" | "CPD & Mentorship";
  features: string[];
  mentors: string[];
  pricingOptions: IPricingOption[];
  image?: string;
  gallery?: string[];
}

export interface IMentor {
  _id: string;
  name: string;
}
