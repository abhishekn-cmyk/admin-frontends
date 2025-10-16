"use client";
import { useState } from "react";
import { Tool } from "@/types/tool";
import { useTools } from "@/hooks/use-tools";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function CareerTools() {
  const {
    tools,
    isLoading,
    addToolMutation: addTool,
    updateToolMutation,
    deleteToolMutation,
    addCategoryMutation,
  } = useTools();

  const [open, setOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [form, setForm] = useState<Partial<Tool>>({
    name: "",
    tagline: "",
    description: "",
    features: [],
    basePrice: 0,
    pricingOptions: [],
    category: "",
    actions: [],
    image: "", // new image field
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);
  const [newCategory, setNewCategory] = useState<{
    title: string;
    description?: string;
    tagline?: string;
    milestone?: string;
    duration?: string;
  }>({
    title: "",
    description: "",
    tagline: "",
    milestone: "",
    duration: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      tagline: "",
      description: "",
      features: [],
      basePrice: 0,
      pricingOptions: [],
      category: "",
      actions: [],
      image: "",
    });
    setEditingTool(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const payload = new FormData();

    // append form fields
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object" && key !== "image") {
          // convert arrays/objects to JSON string
          payload.append(key, JSON.stringify(value));
        } else if (key !== "image") {
          payload.append(key, value.toString());
        }
      }
    });

    // append file if selected
    if (imageFile) {
      payload.append("image", imageFile);
    }

    if (editingTool) {
      updateToolMutation.mutate(
        { id: editingTool._id, formData: payload }, // send FormData
        {
          onSuccess: () => {
            setOpen(false);
            resetForm();
          },
        },
      );
    } else {
      addTool.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          resetForm();
        },
      });
    }
  };

  if (isLoading) return <p className="text-center">Loading tools...</p>;

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>+ Add Tool</Button>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool._id} className="rounded-2xl shadow-lg">
            <CardContent className="flex flex-col gap-3 p-6">
              {tool.image && (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${tool.image}`}
                  alt={tool.name}
                  className="h-32 w-full rounded-lg object-cover"
                />
              )}

              <h2 className="text-xl font-bold">{tool.name}</h2>
              <p className="text-sm text-gray-600">{tool.tagline}</p>
              <p className="text-sm">{tool.description}</p>
              <ul className="list-inside list-disc text-sm text-gray-700">
                {tool.features?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <p className="font-semibold">Base Price: ${tool.basePrice}</p>
              {tool.pricingOptions?.map((opt, i) => (
                <p key={i} className="text-sm">
                  {opt.label}: ${opt.price}
                </p>
              ))}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentTool(tool);
                    setCategoryModalOpen(true);
                    setNewCategory({
                      title: "",
                      description: "",
                      tagline: "",
                      milestone: "",
                      duration: "",
                    });
                  }}
                >
                  Add Category
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingTool(tool);
                    setForm(tool);
                    setImagePreview(tool.image || null);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteToolMutation.mutate(tool._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTool ? "Edit Tool" : "Add Tool"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Tagline"
              value={form.tagline || ""}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Base Price"
              value={form.basePrice || 0}
              onChange={(e) =>
                setForm({ ...form, basePrice: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Category"
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            {/* Image Upload */}
            <div>
              <p className="font-semibold">Tool Image</p>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mb-2 h-40 w-full rounded-lg object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Features */}
            <div>
              <p className="font-semibold">Features</p>
              {form.features?.map((f, i) => (
                <Input
                  key={i}
                  placeholder={`Feature ${i + 1}`}
                  value={f}
                  onChange={(e) => {
                    const updated = [...(form.features || [])];
                    updated[i] = e.target.value;
                    setForm({ ...form, features: updated });
                  }}
                />
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setForm({ ...form, features: [...(form.features || []), ""] })
                }
              >
                + Add Feature
              </Button>
            </div>

            {/* Pricing Options */}
            <div>
              <p className="font-semibold">Pricing Options</p>
              {form.pricingOptions?.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) => {
                      const updated = [...(form.pricingOptions || [])];
                      updated[i].label = e.target.value;
                      setForm({ ...form, pricingOptions: updated });
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={opt.price}
                    onChange={(e) => {
                      const updated = [...(form.pricingOptions || [])];
                      updated[i].price = Number(e.target.value);
                      setForm({ ...form, pricingOptions: updated });
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setForm({
                    ...form,
                    pricingOptions: [
                      ...(form.pricingOptions || []),
                      { label: "", price: 0 },
                    ],
                  })
                }
              >
                + Add Pricing Option
              </Button>
            </div>

            <Button onClick={handleSave}>
              {editingTool ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category to {currentTool?.name}</DialogTitle>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-3">
            <Input
              placeholder="Title"
              value={newCategory.title}
              onChange={(e) =>
                setNewCategory({ ...newCategory, title: e.target.value })
              }
            />
            <Input
              placeholder="Tagline"
              value={newCategory.tagline || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, tagline: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={newCategory.description || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
            <Input
              placeholder="Milestone"
              value={newCategory.milestone || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, milestone: e.target.value })
              }
            />
            <Input
              placeholder="Duration (e.g., 6-8 years)"
              value={newCategory.duration || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, duration: e.target.value })
              }
            />

            <Button
              onClick={() => {
                if (!currentTool) return;
                addCategoryMutation.mutate({
                  toolId: currentTool._id,
                  category: newCategory, // this is your local state from the form
                });
                setCategoryModalOpen(false);
                setNewCategory({
                  title: "",
                  description: "",
                  tagline: "",
                  milestone: "",
                  duration: "",
                });
              }}
            >
              Save Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
