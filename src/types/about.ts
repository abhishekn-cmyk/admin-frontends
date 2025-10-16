export interface Item {
  title: string;
  description: string;
}

export interface AboutType {
  _id: string;
  title: string;
  description: string;
  mission: Item;
  vision: Item;
  whyChoose: {
    title: string;
    subtitle?: string;
    items: Item[];
  };
  researchAndDevelopment: {
    title: string;
    subtitle?: string;
    items: Item[];
  };
  values: {
    title: string;
    items: Item[];
  };
  createdAt: string;
}
