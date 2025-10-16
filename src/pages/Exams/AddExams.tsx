import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

import { Users } from "lucide-react";
import { useExams } from "@/hooks/use-exam";
interface AddExamProps {

  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (exam: any) => void;
}

export default function AddExam({ open, onOpenChange, onSave }: AddExamProps) {
  const { mentorsList = [], mentorsLoading } = useExams({ fetchMentorsEnabled: true });

  const [form, setForm] = useState({
    category: "PLAB",
    subcategory: "",
    title: "",
    subtitle: "",
    description: "",
    features: "",
    mentors: [] as string[],
    bundleItems: "",
    examType: "IELTS", // default value
    tags: "",
    level: "",
    language: "",
    status: "draft" as "draft" | "published" | "archived",
    maxAttempts: "",
    passingScore: "",
    price: "",
    currency: "GBP",
    paymentLink: "",
    pricingOptions: [] as { label: string; price: string }[],
    actions: [] as { label: string; type: string; link: string }[],
    startDate: "",
    endDate: "",
  });

  const addPricingOption = () =>
    setForm({ ...form, pricingOptions: [...form.pricingOptions, { label: "", price: "" }] });

  const addAction = () =>
    setForm({ ...form, actions: [...form.actions, { label: "", type: "enroll", link: "" }] });

  const handleSave = () => {
    const payload = {
      ...form,
      features: form.features ? form.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
      mentors: form.mentors,
      bundleItems: form.bundleItems ? form.bundleItems.split(",").map((b) => b.trim()).filter(Boolean) : [],
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      price: form.price ? Number(form.price) : undefined,
      maxAttempts: form.maxAttempts ? Number(form.maxAttempts) : undefined,
      passingScore: form.passingScore ? Number(form.passingScore) : undefined,
      pricingOptions: form.pricingOptions.map((opt) => ({ label: opt.label, price: Number(opt.price) || 0 })),
      actions: form.actions.map((a) => ({ label: a.label, type: a.type, link: a.link })),
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.endDate ? new Date(form.endDate) : undefined,
    };

    onSave(payload);

    // Reset form
    setForm({
      category: "PLAB",
      subcategory: "",
      title: "",
      subtitle: "",
      description: "",
      features: "",
      mentors: [],
      bundleItems: "",
      examType: "",
      tags: "",
      level: "",
      language: "",
      status: "draft",
      maxAttempts: "",
      passingScore: "",
      price: "",
      currency: "GBP",
      paymentLink: "",
      pricingOptions: [],
      actions: [],
      startDate: "",
      endDate: "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl rounded-xl shadow-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Create New Exam
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              >
                <option value="English Proficiency">English Proficiency</option>
                <option value="PLAB">PLAB</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Input
                placeholder="QBank, Starter Bundle..."
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              />
            </div>

            {/* Exam Type */}
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <select
                value={form.examType}
                onChange={(e) => setForm({ ...form, examType: e.target.value as any })}
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
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

            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Features */}
            <div className="space-y-2 md:col-span-2">
              <Label>Features (comma separated)</Label>
              <Input
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
              {form.features && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.features.split(",").map((f, i) => (
                    <Badge key={i} variant="secondary">{f.trim()}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Mentors */}
            {/* Mentors */}
{/* Selected mentors as badges */}
<div className="space-y-2 md:col-span-2">
  <Label className="text-sm font-medium flex items-center gap-1">
    <Users className="h-4 w-4" /> Mentors
  </Label>

  {/* Selected mentors as badges */}
  <div className="flex flex-wrap gap-2 mb-2">
    {form.mentors.map((mentorId: string) => {
      const mentor = mentorsList.find((m: any) => m._id === mentorId);
      if (!mentor) return null;
      return (
        <Badge
          key={mentor._id}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1 rounded-full"
        >
          <span>{mentor.name}</span>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                mentors: form.mentors.filter((id: string) => id !== mentor._id),
              })
            }
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </Badge>
      );
    })}
  </div>

  {/* Dropdown to add new mentor */}
  <select
    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    onChange={(e) => {
      const value = e.target.value;
      if (value && !form.mentors.includes(value)) {
        setForm({ ...form, mentors: [...form.mentors, value] });
      }
      e.target.value = "";
    }}
    disabled={mentorsLoading}
  >
    <option value="">-- Select Mentor --</option>
    {mentorsList
      .filter((m: any) => !form.mentors.includes(m._id))
      .map((mentor: any) => (
        <option key={mentor._id} value={mentor._id}>
          {mentor.name}
        </option>
      ))}
  </select>
</div>



            {/* Bundle Items */}
            <div className="space-y-2 md:col-span-2">
              <Label>Bundle Items (comma separated)</Label>
              <Input
                value={form.bundleItems}
                onChange={(e) => setForm({ ...form, bundleItems: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2 md:col-span-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>

            {/* Price & Currency */}
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
            {/* Pricing Options */}
<div className="space-y-2 md:col-span-2">
  <Label>Pricing Options</Label>
  {form.pricingOptions.map((opt, idx) => (
    <div key={idx} className="flex gap-2 mb-2">
      <Input
        placeholder="Label"
        value={opt.label}
        onChange={(e) => {
          const updated = [...form.pricingOptions];
          updated[idx].label = e.target.value;
          setForm({ ...form, pricingOptions: updated });
        }}
      />
      <Input
        placeholder="Price"
        type="number"
        value={opt.price}
        onChange={(e) => {
          const updated = [...form.pricingOptions];
          updated[idx].price = e.target.value;
          setForm({ ...form, pricingOptions: updated });
        }}
      />
      <Button
        variant="destructive"
        onClick={() => {
          const updated = form.pricingOptions.filter((_, i) => i !== idx);
          setForm({ ...form, pricingOptions: updated });
        }}
      >
        &times;
      </Button>
    </div>
  ))}
  <Button variant="outline" onClick={addPricingOption}>
    + Add Pricing Option
  </Button>
</div>


            {/* Start / End Dates */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 md:col-span-2">
              <Label>Actions</Label>
              {form.actions.map((a, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={a.label}
                    onChange={(e) => {
                      const updated = [...form.actions];
                      updated[idx].label = e.target.value;
                      setForm({ ...form, actions: updated });
                    }}
                  />
                  <select
                    value={a.type}
                    onChange={(e) => {
                      const updated = [...form.actions];
                      updated[idx].type = e.target.value;
                      setForm({ ...form, actions: updated });
                    }}
                  >
                    <option value="enroll">Enroll</option>
                    <option value="download">Download</option>
                    <option value="consultation">Consultation</option>
                  </select>
                  <Input
                    placeholder="Link"
                    value={a.link}
                    onChange={(e) => {
                      const updated = [...form.actions];
                      updated[idx].link = e.target.value;
                      setForm({ ...form, actions: updated });
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addAction}>+ Add Action</Button>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Create Exam</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
