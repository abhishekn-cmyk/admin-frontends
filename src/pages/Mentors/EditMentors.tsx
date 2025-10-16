import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useApproveMentor, useUpdateMentor } from "@/hooks/useMentor";
import type { IMentor } from "@/types/mentor";
import type { IBackground } from "@/types/mentor";
import InputLabel from "@/components/shared/InputLabel";
interface EditMentorsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mentor: IMentor;
}

export default function EditMentors({
  open,
  setOpen,
  mentor,
}: EditMentorsProps) {
  const [formData, setFormData] = useState<IMentor>({
    ...mentor,
    specialities: [],
    address: "",
  });

  const [gmcCertificate, setGmcCertificate] = useState<File | null>(null);

  const { mutate: updateMentor, isPending: loading } = useUpdateMentor();
  const { mutate: approveMentor, isPending: approving } = useApproveMentor();

  if (!open) return null;
  useEffect(() => {
    setFormData({ ...mentor });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const handleFileChange = (
    field: keyof IMentor,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (field === "gmcCertificate") {
        setGmcCertificate(file);
      } else if (field === "image") {
        setFormData((prev) => ({ ...prev, image: file }));
      } else if (field === "profilePicture") {
        setFormData((prev) => ({ ...prev, profilePicture: file }));
      } else {
        // any other file fields
        setFormData((prev) => ({ ...prev, [field]: file }));
      }
    }
  };

  const addBackground = () => {
    setFormData((prev) => ({
      ...prev,
      background: [
        ...(prev.background || []),
        {
          degree: "",
          institution: "",
          year: undefined,
          description: "",
          achievements: [],
        },
      ],
    }));
  };

  const handleBackgroundChange = (
    index: number,
    field: keyof IBackground,
    value: any,
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.background || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, background: updated };
    });
  };

  const removeBackground = (index: number) => {
    setFormData((prev) => {
      const updated = [...(prev.background || [])];
      updated.splice(index, 1);
      return { ...prev, background: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // 1. Files already handled separately
      if (value instanceof File) {
        body.append(key, value);
      }
      // 2. Arrays
      else if (Array.isArray(value)) {
        // If array of strings (like specialities/languages)
        if (value.every((v) => typeof v === "string")) {
          body.append(key, JSON.stringify(value)); // send as JSON string
        } else {
          // If array of objects (like background items)
          body.append(key, JSON.stringify(value));
        }
      }
      // 3. Plain objects (like background when not wrapped in array)
      else if (typeof value === "object") {
        body.append(key, JSON.stringify(value));
      }
      // 4. Booleans → string
      else if (typeof value === "boolean") {
        body.append(key, value ? "true" : "false");
      }
      // 5. Primitives (string, number)
      else {
        body.append(key, String(value));
      }
    });

    if (gmcCertificate) body.append("gmcCertificate", gmcCertificate);

    updateMentor(
      { id: mentor._id!, data: body },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-card max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-lg shadow-2xl">
        {/* Header */}
        <div className="bg-card flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Edit Mentor</h2>
          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Basic Info */}
          <Section title="Basic Info">
            <InputLabel
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Designation"
              name="designation"
              value={formData.designation || ""}
              onChange={handleChange}
            />
            <InputField
              label="Department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
            />
            <InputField
              label="Position"
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
            />
          </Section>

          {/* Personal Info */}
          <Section title="Personal Info">
            <InputField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </Section>

          {/* Professional Details */}
          <Section title="Professional Details">
            <InputField
              label="GMC Number"
              name="gmcNumber"
              value={formData.gmcNumber}
              onChange={handleChange}
              required
            />
            <InputField
              label="Current NHS Trust"
              name="currentNhsTrust"
              value={formData.currentNhsTrust}
              onChange={handleChange}
              required
            />
            <InputField
              label="Current Role"
              name="currentRole"
              value={formData.currentRole}
              onChange={handleChange}
              required
            />
            <InputField
              label="Specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
            />
            <InputField
              label="Subspecialty"
              name="subspecialty"
              value={formData.subspecialty || ""}
              onChange={handleChange}
            />
            <InputField
              label="Clinical Experience (Years)"
              type="number"
              name="clinicalExperienceYears"
              value={formData.clinicalExperienceYears}
              onChange={handleChange}
              required
            />
            <InputField
              label="NHS Experience (Years)"
              type="number"
              name="nhsExperienceYears"
              value={formData.nhsExperienceYears}
              onChange={handleChange}
              required
            />
          </Section>

          <Section title="Background">
            {formData.background?.map((bg, idx) => (
              <div
                key={idx}
                className="col-span-6 space-y-3 rounded-md border bg-gray-50 p-4"
              >
                <InputField
                  label="Degree"
                  name={`background.${idx}.degree`}
                  value={bg.degree || ""}
                  onChange={(e: any) =>
                    handleBackgroundChange(idx, "degree", e.target.value)
                  }
                />
                <InputField
                  label="Institution"
                  name={`background.${idx}.institution`}
                  value={bg.institution || ""}
                  onChange={(e: any) =>
                    handleBackgroundChange(idx, "institution", e.target.value)
                  }
                />
                <InputField
                  label="Year"
                  type="number"
                  name={`background.${idx}.year`}
                  value={bg.year || ""}
                  onChange={(e: any) =>
                    handleBackgroundChange(idx, "year", e.target.value)
                  }
                />
                <TextAreaField
                  label="Description"
                  name={`background.${idx}.description`}
                  value={bg.description || ""}
                  onChange={(e: any) =>
                    handleBackgroundChange(idx, "description", e.target.value)
                  }
                />
                <TextAreaField
                  label="Achievements (comma-separated)"
                  name={`background.${idx}.achievements`}
                  value={bg.achievements?.join(", ") || ""}
                  onChange={(e: any) =>
                    handleBackgroundChange(
                      idx,
                      "achievements",
                      e.target.value.split(",").map((a: string) => a.trim()),
                    )
                  }
                />
                <button
                  type="button"
                  className="rounded bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200"
                  onClick={() => removeBackground(idx)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="col-span-6">
              <button
                type="button"
                className="rounded bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200"
                onClick={addBackground}
              >
                + Add Background
              </button>
            </div>
          </Section>

          {/* Compliance */}
          <Section title="Compliance">
            {[
              "gmcValid",
              "noFitnessToPracticeIssues",
              "codeOfConductAgreement",
              "qualityReviewConsent",
              "gdprCompliance",
            ].map((field) => (
              <CheckboxField
                key={field}
                label={field}
                name={field}
                checked={Boolean((formData as any)[field])}
                onChange={handleChange}
              />
            ))}
          </Section>
          {/* Address */}
          <InputField
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
          />

          {/* Specialities */}
          <div className="col-span-3">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Specialities
            </label>
            {formData.specialities?.map((spec, index) => (
              <div key={index} className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => {
                    const newSpecialities = [...(formData.specialities || [])];
                    newSpecialities[index] = e.target.value;
                    setFormData({ ...formData, specialities: newSpecialities });
                  }}
                  className="flex-1 rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSpecialities = [...(formData.specialities || [])];
                    newSpecialities.splice(index, 1);
                    setFormData({ ...formData, specialities: newSpecialities });
                  }}
                  className="rounded bg-red-500 px-2 text-white hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  specialities: [...(formData.specialities || []), ""],
                })
              }
              className="mt-2 rounded bg-blue-100 px-4 py-1 text-blue-700 hover:bg-blue-200"
            >
              + Add Speciality
            </button>
          </div>

          {/* Payment & CPD */}
          <Section title="Payment & CPD">
            <InputField
              label="Preferred Payment Method"
              name="preferredPaymentMethod"
              value={formData.preferredPaymentMethod}
              onChange={handleChange}
              required
            />
            <InputField
              label="Tax Info"
              name="taxInfo"
              value={formData.taxInfo || ""}
              onChange={handleChange}
            />
            <CheckboxField
              label="CPD Participation"
              name="cpdParticipation"
              checked={!!formData.cpdParticipation}
              onChange={handleChange}
            />
          </Section>

          {/* Documents */}
          <Section title="Documents">
            <FileField
              label="GMC Certificate"
              field="gmcCertificate"
              onChange={handleFileChange}
              currentFile={mentor?.gmcCertificate}
            />
            <FileField
              label="CV Document"
              field="cvDocument"
              onChange={handleFileChange}
              currentFile={mentor?.cvDocument}
            />
            <FileField
              label="Indemnity Insurance"
              field="indemnityInsurance"
              onChange={handleFileChange}
              currentFile={mentor?.indemnityInsurance}
            />
            <FileField
              label="image"
              field="image"
              onChange={handleFileChange}
              currentFile={mentor?.image}
            />
            <FileField
              label="profilePicture"
              field="profilePicture"
              onChange={handleFileChange}
              currentFile={mentor?.profilePicture}
            />
          </Section>

          {/* Status & Mode */}
          <Section title="Status & Mode">
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={["active", "inactive", "away"]}
            />
            <SelectField
              label="Mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              options={["online", "onsite", "hybrid"]}
            />
          </Section>

          <SelectField
            label="Approved"
            name="approved"
            value={formData.approved}
            onChange={handleChange}
            options={["Approve", "Reject"]}
          />

          <button
            type="button"
            onClick={() =>
              approveMentor(mentor._id!, { onSuccess: () => setOpen(false) })
            }
            disabled={approving}
            className="rounded-md bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {approving ? "Approving..." : "Approve Mentor"}
          </button>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -----------------------
   Reusable Components
------------------------ */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="mb-4 text-lg font-semibold">{title}</h3>
    <div className="grid grid-cols-3 gap-4">{children}</div>
  </div>
);

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
}: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }: any) => (
  <div className="col-span-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      rows={3}
    />
  </div>
);

const CheckboxField = ({ label, name, checked, onChange }: any) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-blue-600"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const FileField = ({ label, field, onChange, currentFile }: any) => (
  <div className="col-span-2">
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="file"
      onChange={(e) => onChange(field, e)}
      className="block w-full rounded-md border text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
    />
    {currentFile && (
      <p className="mt-1 text-sm text-gray-500">
        Current file:{" "}
        <a
          href={currentFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Document
        </a>
      </p>
    )}
  </div>
);
