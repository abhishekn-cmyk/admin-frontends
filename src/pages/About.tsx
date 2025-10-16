"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { useAbout } from "@/hooks/use-about";
import { AboutType } from "@/types/about";

interface Item {
  title: string;
  description: string;
}

interface AboutForm {
  title: string;
  description: string;
  mission: Item;
  vision: Item;
  whyChoose: { title: string; subtitle?: string; items: Item[] };
  researchAndDevelopment: { title: string; subtitle?: string; items: Item[] };
  values: { title: string; items: Item[] };
}

export default function About() {
  const { abouts, isLoading, saveMutation, deleteMutation } = useAbout();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm: AboutForm = {
    title: "",
    description: "",
    mission: { title: "", description: "" },
    vision: { title: "", description: "" },
    whyChoose: { title: "", subtitle: "", items: [] },
    researchAndDevelopment: { title: "", subtitle: "", items: [] },
    values: { title: "", items: [] },
  };

  const [form, setForm] = useState<AboutForm>(emptyForm);

  const handleSubmit = () => {
    saveMutation.mutate({ id: editingId ?? undefined, payload: form });
    setForm(emptyForm);
    setEditingId(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this About?")) {
      deleteMutation.mutate(id);
    }
  };

  const addItem = (section: "whyChoose" | "researchAndDevelopment" | "values") => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: [...prev[section].items, { title: "", description: "" }],
      },
    }));
  };

  return (
    <div className="p-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">About Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
              }}
            >
              Add About
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit About" : "Add About"}</DialogTitle>
            </DialogHeader>

            {/* Basic fields */}
            <Input
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            {/* Mission */}
            <h3 className="font-semibold mt-4">Mission</h3>
            <Input
              placeholder="Mission Title"
              value={form.mission.title}
              onChange={e => setForm({ ...form, mission: { ...form.mission, title: e.target.value } })}
            />
            <Textarea
              placeholder="Mission Description"
              value={form.mission.description}
              onChange={e => setForm({ ...form, mission: { ...form.mission, description: e.target.value } })}
            />

            {/* Vision */}
            <h3 className="font-semibold mt-4">Vision</h3>
            <Input
              placeholder="Vision Title"
              value={form.vision.title}
              onChange={e => setForm({ ...form, vision: { ...form.vision, title: e.target.value } })}
            />
            <Textarea
              placeholder="Vision Description"
              value={form.vision.description}
              onChange={e => setForm({ ...form, vision: { ...form.vision, description: e.target.value } })}
            />

            {/* Why Choose */}
            <h3 className="font-semibold mt-4">Why Choose Us</h3>
            <Input
              placeholder="Section Title"
              value={form.whyChoose.title}
              onChange={e => setForm({ ...form, whyChoose: { ...form.whyChoose, title: e.target.value } })}
            />
            <Button variant="outline" size="sm" onClick={() => addItem("whyChoose")}>
              + Add Item
            </Button>
            {form.whyChoose.items.map((item, idx) => (
              <div key={idx} className="mt-2 space-y-2 border p-2 rounded-md">
                <Input
                  placeholder="Item Title"
                  value={item.title}
                  onChange={e => {
                    const updated = [...form.whyChoose.items];
                    updated[idx].title = e.target.value;
                    setForm({ ...form, whyChoose: { ...form.whyChoose, items: updated } });
                  }}
                />
                <Textarea
                  placeholder="Item Description"
                  value={item.description}
                  onChange={e => {
                    const updated = [...form.whyChoose.items];
                    updated[idx].description = e.target.value;
                    setForm({ ...form, whyChoose: { ...form.whyChoose, items: updated } });
                  }}
                />
              </div>
            ))}

            {/* Research & Development */}
            <h3 className="font-semibold mt-4">Research & Development</h3>
            <Button variant="outline" size="sm" onClick={() => addItem("researchAndDevelopment")}>
              + Add Item
            </Button>
            {form.researchAndDevelopment.items.map((item, idx) => (
              <div key={idx} className="mt-2 space-y-2 border p-2 rounded-md">
                <Input
                  placeholder="Item Title"
                  value={item.title}
                  onChange={e => {
                    const updated = [...form.researchAndDevelopment.items];
                    updated[idx].title = e.target.value;
                    setForm({ ...form, researchAndDevelopment: { ...form.researchAndDevelopment, items: updated } });
                  }}
                />
                <Textarea
                  placeholder="Item Description"
                  value={item.description}
                  onChange={e => {
                    const updated = [...form.researchAndDevelopment.items];
                    updated[idx].description = e.target.value;
                    setForm({ ...form, researchAndDevelopment: { ...form.researchAndDevelopment, items: updated } });
                  }}
                />
              </div>
            ))}

            {/* Values */}
            <h3 className="font-semibold mt-4">Values</h3>
            <Button variant="outline" size="sm" onClick={() => addItem("values")}>
              + Add Value
            </Button>
            {form.values.items.map((item, idx) => (
              <div key={idx} className="mt-2 space-y-2 border p-2 rounded-md">
                <Input
                  placeholder="Value Title"
                  value={item.title}
                  onChange={e => {
                    const updated = [...form.values.items];
                    updated[idx].title = e.target.value;
                    setForm({ ...form, values: { ...form.values, items: updated } });
                  }}
                />
                <Textarea
                  placeholder="Value Description"
                  value={item.description}
                  onChange={e => {
                    const updated = [...form.values.items];
                    updated[idx].description = e.target.value;
                    setForm({ ...form, values: { ...form.values, items: updated } });
                  }}
                />
              </div>
            ))}

            <Button onClick={handleSubmit} className="w-full mt-4">
              {editingId ? "Update" : "Save"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Abouts */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {abouts.map((item: AboutType) => (
            <Card key={item._id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setForm(item);
                        setEditingId(item._id);
                        setOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600">{item.description}</p>
                <div>
                  <strong>Mission:</strong> {item.mission.title} - {item.mission.description}
                </div>
                <div>
                  <strong>Vision:</strong> {item.vision.title} - {item.vision.description}
                </div>
                <div>
                  <strong>Why Choose:</strong>
                  <ul className="list-disc ml-5">
                   {item.whyChoose.items.map((wc: Item, idx: number) => (
  <li key={idx}>{wc.title}: {wc.description}</li>
))}

                  </ul>
                </div>
                <div>
                  <strong>R&D:</strong>
                  <ul className="list-disc ml-5">
                    {item.researchAndDevelopment.items.map((rd: Item, idx: number) => (
  <li key={idx}>{rd.title}: {rd.description}</li>
))}
                  </ul>
                </div>
                <div>
                  <strong>Values:</strong>
                  <ul className="list-disc ml-5">
                   {item.values.items.map((v: Item, idx: number) => (
  <li key={idx}>{v.title}: {v.description}</li>
))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

