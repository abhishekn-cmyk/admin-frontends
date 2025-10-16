"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createProposal } from "@/api/research";
import { IProposal } from "@/types/research";

interface Props { open: boolean; onClose: () => void; onSuccess?: () => void; }

export default function ProposalDialog({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<IProposal>({ title: "", description: "", date: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Title is required!");
    setLoading(true);
    try {
      await createProposal(form);
      setForm({ title: "", description: "", date: "" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Proposal</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label htmlFor="title">Title</Label><Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Title" /></div>
          <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Description" /></div>
          <div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" value={form.date} onChange={handleChange} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
