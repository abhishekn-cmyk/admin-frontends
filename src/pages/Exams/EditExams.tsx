import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

import type { Exam } from "@/types/exam";

// Fetch mentors
// Check the actual API response structure
const fetchMentors = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/mentor`);
  console.log("API Response:", res.data); // Add this to debug
  return res.data.data || []; // Make sure this is the correct path
};

interface EditExamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam;
  onUpdate: (exam: Exam) => void;
}
// Utility function to get display name
const getMentorName = (mentor: any) =>
  mentor.fullName || mentor.name || `Mentor ${mentor._id}`;

// Mentor Badges component
const MentorBadges = ({
  mentors,
  mentorsList,
  onRemove,
}: {
  mentors: string[];
  mentorsList: any[];
  onRemove: (id: string) => void;
}) => {
  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {mentors.map((id) => {
        const mentor = mentorsList.find((m) => m._id === id);
        if (!mentor) return null;
        return (
          <Badge
            key={id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <span>{getMentorName(mentor)}</span>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </Badge>
        );
      })}
    </div>
  );
};

// Mentor Selector component
const MentorSelector = ({
  mentors,
  mentorsList,
  onAdd,
  disabled,
}: {
  mentors: string[];
  mentorsList: any[];
  onAdd: (id: string) => void;
  disabled?: boolean;
}) => {
  return (
    <select
      className="w-full rounded-lg border p-2.5"
      onChange={(e) => {
        const value = e.target.value;
        if (value && !mentors.includes(value)) {
          onAdd(value);
        }
        e.target.value = "";
      }}
      disabled={disabled}
    >
      <option value="">-- Select Mentor --</option>
      {mentorsList
        .filter((m: any) => !!m._id && !mentors.includes(m._id))
        .map((mentor: any) => (
          <option key={mentor._id} value={mentor._id}>
            {getMentorName(mentor)}
          </option>
        ))}
    </select>
  );
};

export default function EditExam({
  open,
  onOpenChange,
  exam,
  onUpdate,
}: EditExamProps) {
  const [form, setForm] = useState<Exam>({
    category: "PLAB",
    title: "",
    description: "",
    features: [],
    actions: [],
    bundleItems: [],
    mentors: [],
    pricingOptions: [],
    timeline: [],
    components: [],
    mentorship: { included: false, type: "1:1", sessions: 0 },
  } as Exam);

  // Sync form when exam changes
  useEffect(() => {
    if (exam) {
      setForm({
        ...exam,
        features: exam.features || [],
        actions: exam.actions || [],
        bundleItems: exam.bundleItems || [],
        mentors: exam.mentors || [],
        pricingOptions: exam.pricingOptions || [],
        timeline: exam.timeline || [],
        components: exam.components || [],
        mentorship: exam.mentorship || {
          included: false,
          type: "1:1",
          sessions: 0,
        },
      });
    }
  }, [exam]);

  // Fetch mentors dynamically
  const {
    data: mentorsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mentors"],
    queryFn: fetchMentors,
    enabled: open,
  });

  // Calculate duration
  const duration = useMemo(() => {
    if (!form.startDate || !form.endDate) return "";
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return "";
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffDays >= 7) return `${Math.floor(diffDays / 7)} week(s)`;
    if (diffDays >= 1) return `${diffDays} day(s)`;
    return `${diffHours}h ${diffMinutes}m`;
  }, [form.startDate, form.endDate]);

  const handleUpdate = () => {
    onUpdate(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden rounded-xl p-0 shadow-xl">
        <DialogHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <FileText className="h-6 w-6 text-blue-600" />
            Edit Exam
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          {isLoading && <div>Loading mentors...</div>}
          {error && <div className="text-red-600">Failed to load mentors.</div>}

          {/* --- Grid Form --- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={form.subtitle || ""}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Input
                value={form.subcategory || ""}
                onChange={(e) =>
                  setForm({ ...form, subcategory: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as any })
                }
                className="w-full rounded-lg border p-2.5"
              >
                <option value="English Proficiency">English Proficiency</option>
                <option value="PLAB">PLAB</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* Exam Type */}
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <select
                value={form.examType || ""}
                onChange={(e) =>
                  setForm({ ...form, examType: e.target.value as any })
                }
                className="w-full rounded-lg border p-2.5"
              >
                <option value="">Select Exam Type</option>
                <option value="IELTS">IELTS</option>
                <option value="OET">OET</option>
                <option value="PLAB-1">PLAB-1</option>
                <option value="MRCP">MRCP</option>
                <option value="MRCS">MRCS</option>
                <option value="MRCOG">MRCOG</option>
                <option value="MRCPCH">MRCPCH</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-3">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Features */}
            <div className="space-y-2 md:col-span-2">
              <Label>Features (one per line)</Label>
              <Textarea
                value={form.features.join("\n")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: e.target.value
                      .split("\n") // split by newline
                      .map((f) => f.trim())
                      .filter(Boolean), // remove empty lines
                  })
                }
                rows={4} // adjust height
              />
              <div className="mt-2 flex flex-col gap-1">
                {form.features.map((f, idx) => (
                  <Badge key={idx} variant="secondary">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mentors */}
            <div className="space-y-2 md:col-span-2">
              <Label>Mentors</Label>

              <MentorBadges
                mentors={form.mentors ?? []}
                mentorsList={mentorsList}
                onRemove={(id) =>
                  setForm({
                    ...form,
                    mentors: (form.mentors ?? []).filter((m) => m !== id),
                  })
                }
              />

              <MentorSelector
                mentors={form.mentors ?? []}
                mentorsList={mentorsList}
                onAdd={(id) =>
                  setForm({
                    ...form,
                    mentors: [...(form.mentors ?? []), id],
                  })
                }
                disabled={isLoading}
              />
            </div>

            {/* Bundle Items */}
            <div className="space-y-2 md:col-span-2">
              <Label>Bundle Items (comma separated)</Label>
              <Input
                value={form.bundleItems?.join(", ") || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bundleItems: e.target.value
                      .split(",")
                      .map((b) => b.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                value={form.currency || "GBP"}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>

            {/* Pricing Options */}
            <div className="space-y-2 md:col-span-3">
              <Label>Pricing Options</Label>
              {(form.pricingOptions ?? []).map((opt, idx) => (
                <div key={idx} className="mb-2 flex gap-2">
                  <Input
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) => {
                      const updated = [...(form.pricingOptions ?? [])];
                      updated[idx].label = e.target.value;
                      setForm({ ...form, pricingOptions: updated });
                    }}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={opt.price}
                    onChange={(e) => {
                      const updated = [...(form.pricingOptions ?? [])];
                      updated[idx].price = Number(e.target.value);
                      setForm({ ...form, pricingOptions: updated });
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setForm({
                        ...form,
                        pricingOptions: (form.pricingOptions ?? []).filter(
                          (_, i) => i !== idx,
                        ),
                      })
                    }
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>

            {/* Start/End Dates & Duration */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={
                  form.startDate
                    ? new Date(form.startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={
                  form.endDate
                    ? new Date(form.endDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input value={duration} disabled className="bg-gray-100" />
            </div>

            {/* Actions */}
            <div className="space-y-2 md:col-span-3">
              <Label>Actions</Label>
              {(form.actions ?? []).map((a, idx) => (
                <div key={idx} className="mb-2 flex gap-2">
                  <Input
                    placeholder="Label"
                    value={a.label}
                    onChange={(e) => {
                      const updated = [...(form.actions ?? [])];
                      updated[idx].label = e.target.value;
                      setForm({ ...form, actions: updated });
                    }}
                  />
                  <select
                    value={a.type}
                    onChange={(e) => {
                      const updated = [...(form.actions ?? [])];
                      updated[idx].type = e.target.value as any;
                      setForm({ ...form, actions: updated });
                    }}
                  >
                    <option value="enroll">Enroll</option>
                    <option value="download">Download</option>
                    <option value="consultation">Consultation</option>
                    <option value="purchase">Purchase</option>
                  </select>
                  <Input
                    placeholder="Link"
                    value={a.link}
                    onChange={(e) => {
                      const updated = [...(form.actions ?? [])];
                      updated[idx].link = e.target.value;
                      setForm({ ...form, actions: updated });
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setForm({
                        ...form,
                        actions: (form.actions ?? []).filter(
                          (_, i) => i !== idx,
                        ),
                      })
                    }
                  >
                    &times;
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setForm({
                    ...form,
                    actions: [
                      ...(form.actions ?? []),
                      { label: "", type: "enroll", link: "" },
                    ],
                  })
                }
              >
                + Add Action
              </Button>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleUpdate}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
