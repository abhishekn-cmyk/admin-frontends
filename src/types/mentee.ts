

// Mentee interface from MongoDB
export interface IMentee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  goals?: string[];
  interests?: string[];
  languagePreferences?: string[];
  availability?: string;
  mentorPreferences?: string[];
  mentors?: string[]; // linked mentors (ObjectId as string)
  createdAt?: string;
  updatedAt?: string;
}

// Input for creating a mentee (omit _id, timestamps)
export type CreateMenteeInput = Omit<IMentee, "_id" | "createdAt" | "updatedAt" | "mentors"> & {
  goals: string[];
  interests: string[];
  languagePreferences: string[];
  mentorPreferences: string[];
};

// Input for updating a mentee (partial)
export type UpdateMenteeInput = Partial<CreateMenteeInput>;


