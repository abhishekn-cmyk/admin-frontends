import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUpdateProgram } from "@/hooks/useprogram"; // ✅ import hook

interface EditProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: any;
  onUpdated: () => void;
}

export default function EditProgramModal({
  open,
  onOpenChange,
  program,
  onUpdated,
}: EditProgramModalProps) {
  // ===== Local Form State =====
  const [form, setForm] = useState<any>(program || {});
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [pricingOptions, setPricingOptions] = useState<any[]>([]);
  const [pricingInput, setPricingInput] = useState({
    name: "",
    price: "",
    type: "cpd",
  });
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<FileList | null>(null);

  // ===== Sync props → local state =====
  useEffect(() => {
    if (program) {
      setForm(program);
      setSelectedMentors(program.mentors?.map((m: any) => m._id) || []);
      setFeatures(program.features || []);
      setPricingOptions(program.pricingOptions || []);
    }
  }, [program]);

  // ===== Query: Mentors =====
  const { data: mentors = [] } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mentor`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      return res.data.data;
    },
    enabled: open,
    initialData: [], // 👈 ensures mentors is always []
  });

  // ===== Mutation: Update Program =====
  const { mutate: updateProgram, isPending } = useUpdateProgram();

  // ===== Handlers =====
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("description", form.description);
    formData.append("category", form.category || "CPD");
    formData.append("features", JSON.stringify(features));
    formData.append("mentors", JSON.stringify(selectedMentors));
    formData.append("pricingOptions", JSON.stringify(pricingOptions));

    if (image) formData.append("image", image);
    if (gallery) {
      Array.from(gallery).forEach((file) => {
        formData.append("gallery", file);
      });
    }

    updateProgram(
      { id: form._id, formData }, // <--- use 'formData', not 'data'
      {
        onSuccess: () => {
          onUpdated();
          toast.success("Program Edited Successfully");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to update program");
        },
      },
    );
  };

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Subtitle */}
          <div>
            <Label>Subtitle</Label>
            <Input
              value={form.subtitle || ""}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              value={form.category || "CPD"}
              onValueChange={(val) => setForm({ ...form, category: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CPD">CPD</SelectItem>
                <SelectItem value="Mentorship">Mentorship</SelectItem>
                <SelectItem value="CPD & Mentorship">
                  CPD & Mentorship
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Features */}
          <div>
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  if (featureInput.trim()) {
                    setFeatures([...features, featureInput.trim()]);
                    setFeatureInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>
            <ul className="mt-2 list-inside list-disc text-sm">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Pricing Options */}
          <div>
            <Label>Pricing Options</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Name"
                value={pricingInput.name}
                onChange={(e) =>
                  setPricingInput({ ...pricingInput, name: e.target.value })
                }
              />
              <Input
                placeholder="Price"
                type="number"
                value={pricingInput.price}
                onChange={(e) =>
                  setPricingInput({ ...pricingInput, price: e.target.value })
                }
              />
              <Select
                value={pricingInput.type}
                onValueChange={(val) =>
                  setPricingInput({ ...pricingInput, type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpd">CPD</SelectItem>
                  <SelectItem value="mentorship">Mentorship</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              className="mt-2"
              onClick={() => {
                if (pricingInput.name && pricingInput.price) {
                  setPricingOptions([...pricingOptions, pricingInput]);
                  setPricingInput({ name: "", price: "", type: "cpd" });
                }
              }}
              variant="secondary"
            >
              Add Pricing
            </Button>
            <ul className="mt-2 list-inside list-disc text-sm">
              {pricingOptions.map((p, i) => (
                <li key={i}>
                  {p.name} – {p.price} ({p.type})
                </li>
              ))}
            </ul>
          </div>

          {/* Mentors */}
          <div>
            <Label>Mentors</Label>
            <Select
              onValueChange={(value) =>
                setSelectedMentors((prev) =>
                  prev.includes(value) ? prev : [...prev, value],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose mentor(s)" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((m: any) => (
                  <SelectItem key={m._id} value={m._id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedMentors.map((id) => {
                const mentor = mentors.find((m: any) => m._id === id);
                return (
                  <span
                    key={id}
                    className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800"
                  >
                    {mentor?.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Replace Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          {/* Gallery Upload */}
          <div>
            <Label>Replace Gallery</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGallery(e.target.files)}
            />
          </div>

          {/* Update Button */}
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update Program"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
