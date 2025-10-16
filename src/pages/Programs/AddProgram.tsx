import { useState } from "react";
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
import { useMentors, useCreateProgram } from "@/hooks/useprogram";
import { IPricingOption } from "@/types/program";

interface AddProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddProgramModal({
  open,
  onOpenChange,
}: AddProgramModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CPD");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [pricingOptions, setPricingOptions] = useState<IPricingOption[]>([]);
  const [pricingInput, setPricingInput] = useState<IPricingOption>({
    name: "",
    price: 0,
    type: "cpd",
  });

  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<FileList | null>(null);

  const { data: mentors = [], isLoading } = useMentors();
  const createProgram = useCreateProgram();

  // --- Handlers ---
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleAddPricing = () => {
    if (pricingInput.name && pricingInput.price) {
      setPricingOptions([...pricingOptions, pricingInput]);
      setPricingInput({ name: "", price: 0, type: "cpd" });
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("features", JSON.stringify(features));
      formData.append("mentors", JSON.stringify(selectedMentors));
      formData.append("pricingOptions", JSON.stringify(pricingOptions));

      if (image) formData.append("image", image);
      if (gallery) {
        Array.from(gallery).forEach((file) => {
          formData.append("gallery", file);
        });
      }

      await createProgram.mutateAsync(formData);

      toast.success("Program added successfully");
      onOpenChange(false);

      // Reset form
      setTitle("");
      setSubtitle("");
      setDescription("");
      setCategory("CPD");
      setFeatures([]);
      setSelectedMentors([]);
      setPricingOptions([]);
      setImage(null);
      setGallery(null);
    } catch (err) {
      toast.error("Failed to add program");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Program</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Subtitle */}
          <div>
            <Label>Subtitle</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CPD">CPD</SelectItem>
                <SelectItem value="Mentorship">Mentorship</SelectItem>
                <SelectItem value="CPD & Mentorship">CPD & Mentorship</SelectItem>
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
              <Button type="button" onClick={handleAddFeature}>
                Add
              </Button>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm">
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
                  setPricingInput({
                    ...pricingInput,
                    price: Number(e.target.value),
                  })
                }
              />
              <Select
                value={pricingInput.type}
                onValueChange={(val) =>
                  setPricingInput({ ...pricingInput, type: val as any })
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
              onClick={handleAddPricing}
              variant="secondary"
            >
              Add Pricing
            </Button>
            <ul className="mt-2 list-disc list-inside text-sm">
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
                  prev.includes(value) ? prev : [...prev, value]
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading..." : "Choose mentor(s)"} />
              </SelectTrigger>
              <SelectContent>
               {mentors.map((m) => (
  <SelectItem key={m._id} value={m._id!}>
    {m.name}
  </SelectItem>
))}

              </SelectContent>
            </Select>
            <div className="flex gap-2 mt-2 flex-wrap">
              {selectedMentors.map((id) => {
                const mentor = mentors.find((m) => m._id === id);
                return (
                  <span
                    key={id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                  >
                    {mentor?.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          {/* Gallery Upload */}
          <div>
            <Label>Gallery</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGallery(e.target.files)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={createProgram.isPending}
          >
            {createProgram.isPending ? "Saving..." : "Save Program"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
