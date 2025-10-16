"use client";

import { useState } from "react";
import { EnterpriseSolution } from "@/types/trust";
import {
  useTrustSolutions,
  useSaveTrustSolution,
  useDeleteTrustSolution,
} from "@/hooks/usetrust";
import { toast } from "sonner";

const FEATURES = [
  "GapMap",
  "InterviewSim",
  "CPD",
  "Analytics Dashboards",
  "Cohort Tracking",
  "White-label Branding",
];
const TARGETS = ["NHS Trusts", "Deaneries", "Medical Schools", "Medical Institutions"];

export default function Trust() {
  const [form, setForm] = useState<Partial<EnterpriseSolution>>({});
  const { data: solutions = [], isLoading } = useTrustSolutions();
  const saveMutation = useSaveTrustSolution();
  const deleteMutation = useDeleteTrustSolution();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form as EnterpriseSolution, {
      onSuccess: () => {
        toast.success(form._id ? "Solution Updated" : "Solution Created");
        setForm({});
      },
      onError: () => toast.error("Failed to save solution"),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this solution?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Solution Deleted"),
        onError: () => toast.error("Failed to delete solution"),
      });
    }
  };

  const handleEdit = (solution: EnterpriseSolution) => setForm(solution);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">B2B / Trust Solutions Admin</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Min Users"
            value={form.minUsers || ""}
            onChange={(e) => setForm({ ...form, minUsers: Number(e.target.value) })}
            className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <textarea
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Target Institutions */}
        <select
          multiple
          value={form.targetInstitutions || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
            setForm({ ...form, targetInstitutions: selected });
          }}
          className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {TARGETS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Features */}
        <select
          multiple
          value={form.features || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
            setForm({ ...form, features: selected });
          }}
          className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {FEATURES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4 mt-2">
          {[
            ["White Label", "isWhiteLabel"],
            ["Analytics Dashboards", "hasAnalyticsDashboards"],
            ["Cohort Tracking", "hasCohortTracking"],
            ["Bulk User Management", "hasBulkUserManagement"],
            ["Contact Sales Required", "contactSalesRequired"],
          ].map(([label, key]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!form[key as keyof EnterpriseSolution]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="h-5 w-5 accent-blue-500"
              />
              <span className="text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 mt-4"
        >
          {saveMutation.isPending
            ? "Saving..."
            : form._id
            ? "Update"
            : "Create"}{" "}
          Solution
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {isLoading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Description</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solutions.map((s) => (
                <tr key={s._id}>
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.description}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id!)}
                      disabled={deleteMutation.isPending}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-200"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
