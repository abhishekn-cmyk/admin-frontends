import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateMentee } from "@/hooks/useMentees";
import { CreateMenteeInput } from "@/types/mentee";
import { IMentee } from "@/types/mentee";
interface AddMenteesProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mentor: { _id: string; name: string };
}

export default function AddMentees({ isOpen, setIsOpen, mentor }: AddMenteesProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateMenteeInput>({
    name: "",
    email: "",
    phone: "",
    goals: [],
    interests: [],
    languagePreferences: [],
    availability: "",
    mentorPreferences: [],
  });

  const createMenteeMutation = useCreateMentee();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // For array fields, split by comma
    if (["goals", "interests", "languagePreferences", "mentorPreferences"].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value.split(",").map(s => s.trim()) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const dataToSubmit: Omit<IMentee, "_id" | "createdAt" | "updatedAt" | "mentors"> & {
    goals: string[];
    interests: string[];
    languagePreferences: string[];
    mentorPreferences: string[];
    mentors: string[]; // <-- this must match backend
  } = {
    ...formData,
    mentors: [mentor._id], // sending as 'mentors'
  };

  createMenteeMutation.mutate(dataToSubmit, {
    onSuccess: () => {
      setIsOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        goals: [],
        interests: [],
        languagePreferences: [],
        availability: "",
        mentorPreferences: [],
      });
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });
};


  const mentorName = mentor.name;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Mentee for {mentorName}</DialogTitle>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Goals (comma separated)</label>
            <input
              name="goals"
              value={formData.goals.join(", ")}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Interests (comma separated)</label>
            <input
              name="interests"
              value={formData.interests.join(", ")}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Language Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Language Preferences (comma separated)</label>
            <input
              name="languagePreferences"
              value={formData.languagePreferences.join(", ")}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <input
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Mentor Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mentor Preferences (comma separated)</label>
            <input
              name="mentorPreferences"
              value={formData.mentorPreferences.join(", ")}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
