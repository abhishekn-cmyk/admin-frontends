export interface Feature {
  description: string;
}

export interface PricingOption {
  type: "monthly" | "yearly" | "one-time";
  price: number;
  currency: string;
  durationInMonths?: number;
  label?: string;
}

export interface Bundle {
  _id: string;
  name: string;
  category: "subscription" | "bundle";
  tagline?: string;
  description?: string;
  features: Feature[];
  pricingOptions: PricingOption[];
  highlightTag?: string;
  isActive: boolean;
}
