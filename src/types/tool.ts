// Subcategory
export interface SubCategory {
  title: string;
  description?: string;
  tagline?: string;
}

// Category
export interface Category {
  title: string;
  description?: string;
  tagline?: string;
  milestone?: string;
  duration?: string;
  subcategories?: SubCategory[];
}

// Pricing Option
export interface PricingOption {
  label: string;
  price: number;
}

// Action
export interface Action {
  label: string;
  type: "link" | "button";
  url?: string;
}

// Tool
export interface Tool {
  _id: string;           // MongoDB ObjectId
  name: string;
  tagline:string;
  description:string;
  categories: Category[];
  features?: string[];
  basePrice: number;
  pricingOptions?: PricingOption[];
  category?: string;     // e.g., "Pathway", "Most Popular"
  actions?: Action[];
  image?: string;
  createdAt: string;     // ISO string
  updatedAt: string;     // ISO string
}

