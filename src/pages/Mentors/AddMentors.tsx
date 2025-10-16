import { useState } from "react";
import { X } from "lucide-react";

import { toast } from "sonner";
import { useCreateMentor } from "@/hooks/useMentor";

interface AddMentorsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddMentors({ open, setOpen }: AddMentorsProps) {
  const [form, setForm] = useState({
    name: "",
    fullName: "",
    email: "",
    phone: "",
    gmcNumber: "",
    currentNhsTrust: "",
    currentRole: "",
    specialty: "",
    clinicalExperienceYears: "",
    nhsExperienceYears: "",
    availability: "",
    mentorshipFormat: "",
    preferredPaymentMethod: "",
  });

  const [specialities, setSpecialities] = useState<string[]>([]);
  const [mentorshipAreas, setMentorshipAreas] = useState<string[]>([]);
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);

  const [compliance, setCompliance] = useState({
    gmcValid: false,
    noFitnessToPracticeIssues: false,
    codeOfConductAgreement: false,
    qualityReviewConsent: false,
    gdprCompliance: false,
    allowPublicProfile: false,
  });

  const [gmcCertificate, setGmcCertificate] = useState<File | null>(null);
  
const { mutate: createMentor, isPending: loading } = useCreateMentor();


  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => formData.append(key, value));

  formData.append("specialities", JSON.stringify(specialities));
  formData.append("mentorshipAreas", JSON.stringify(mentorshipAreas));
  formData.append("languagesSpoken", JSON.stringify(languagesSpoken));

  Object.entries(compliance).forEach(([key, value]) =>
    formData.append(key, String(value))
  );

  if (gmcCertificate) formData.append("gmcCertificate", gmcCertificate);

  createMentor(formData, {
    onSuccess: () => {
      toast.success("Mentor created successfully!");
      setOpen(false);
    },
  });
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Mentor</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* ===== Basic Info ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* ===== Professional ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GMC Number</label>
                <input
                  name="gmcNumber"
                  value={form.gmcNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current NHS Trust</label>
                <input
                  name="currentNhsTrust"
                  value={form.currentNhsTrust}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
              <input
                name="currentRole"
                value={form.currentRole}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <input
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Experience (Years)</label>
                <input
                  type="number"
                  name="clinicalExperienceYears"
                  value={form.clinicalExperienceYears}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NHS Experience (Years)</label>
                <input
                  type="number"
                  name="nhsExperienceYears"
                  value={form.nhsExperienceYears}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* ===== Arrays ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialities</label>
              <input
                placeholder="Comma separated"
                onChange={(e) => setSpecialities(e.target.value.split(","))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mentorship Areas</label>
              <input
                placeholder="Comma separated"
                onChange={(e) => setMentorshipAreas(e.target.value.split(","))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
              <input
                placeholder="Comma separated"
                onChange={(e) => setLanguagesSpoken(e.target.value.split(","))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* ===== Availability & Payment ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <input
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentorship Format</label>
                <input
                  name="mentorshipFormat"
                  value={form.mentorshipFormat}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* ===== Compliance ===== */}
            <fieldset className="space-y-2 border rounded-lg p-3">
              <legend className="text-sm font-semibold text-gray-700">Compliance</legend>
              {Object.entries(compliance).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setCompliance({ ...compliance, [key]: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {key}
                </label>
              ))}
            </fieldset>

            {/* ===== Payment ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Method</label>
              <input
                name="preferredPaymentMethod"
                value={form.preferredPaymentMethod}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* ===== File Upload ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GMC Certificate</label>
              <input
                type="file"
                onChange={(e) => setGmcCertificate(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-600 border rounded-lg p-2"
                required
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
