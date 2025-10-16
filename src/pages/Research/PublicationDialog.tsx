"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createPublication } from "@/api/research";
import { IPublication } from "@/types/research";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PublicationDialog({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<IPublication>({
    title: "",
    authors: [],
    date: "",
    summary: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "authors") {
      setForm((prev) => ({ ...prev, authors: value.split(",").map(a => a.trim()) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Title is required!");
    setLoading(true);
    try {
      await createPublication(form);
      setForm({ title: "", authors: [], date: "", summary: "", category: "" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Publication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Enter publication title" />
          </div>
          <div>
            <Label htmlFor="authors">Authors (comma separated)</Label>
            <Input id="authors" name="authors" value={form.authors.join(", ")} onChange={handleChange} placeholder="Dr. John Doe, Prof. Smith" />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" name="summary" value={form.summary} onChange={handleChange} placeholder="Brief summary" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Healthcare Policy" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
