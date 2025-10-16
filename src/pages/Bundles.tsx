import { useState } from "react";
import { Bundle,  PricingOption } from "@/types/bundle";
import { useBundles } from "@/hooks/use-bundles";

export default function Bundles() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<Bundle, "_id"> & { _id?: string }>({
    name: "",
    category: "bundle",
    tagline: "",
    description: "",
    features: [{ description: "" }],
    pricingOptions: [{ type: "one-time", price: 0, currency: "GBP" }],
    highlightTag: "",
    isActive: true,
  });

  const { bundles, isLoading, isError, saveBundle, deleteBundle } = useBundles();

  // Edit a bundle
  const editBundle = (bundle: Bundle) => {
    setForm(bundle);
    setEditing(true);
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      category: "bundle",
      tagline: "",
      description: "",
      features: [{ description: "" }],
      pricingOptions: [{ type: "one-time", price: 0, currency: "GBP" }],
      highlightTag: "",
      isActive: true,
    });
    setEditing(false);
  };

  // Features handlers
  const updateFeature = (i: number, value: string) => {
    const newFeatures = [...form.features];
    newFeatures[i].description = value;
    setForm({ ...form, features: newFeatures });
  };
  const addFeature = () => setForm({ ...form, features: [...form.features, { description: "" }] });
  const removeFeature = (i: number) => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });

  // Pricing handlers
  const updatePricing = (i: number, field: keyof PricingOption, value: string | number | undefined) => {
    const newPricing = [...form.pricingOptions];
    (newPricing[i] as any)[field] = value;
    setForm({ ...form, pricingOptions: newPricing });
  };
  const addPricing = () =>
    setForm({ ...form, pricingOptions: [...form.pricingOptions, { type: "one-time", price: 0, currency: "GBP" }] });
  const removePricing = (i: number) =>
    setForm({ ...form, pricingOptions: form.pricingOptions.filter((_, idx) => idx !== i) });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin: Manage Products / Bundles</h1>

      {/* Bundle List */}
      {isLoading ? (
        <p className="text-center">Loading bundles...</p>
      ) : isError ? (
        <p className="text-red-600 text-center mb-4">Failed to fetch bundles.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <div
              key={bundle._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1">{bundle.name}</h2>
                {bundle.tagline && <p className="text-gray-500 mb-1">{bundle.tagline}</p>}
                <p className="text-gray-700 mb-1">{bundle.description}</p>
                <p className="text-sm text-gray-600">Category: {bundle.category}</p>
                {bundle.highlightTag && (
                  <p className="text-sm font-medium text-purple-600">Highlight: {bundle.highlightTag}</p>
                )}
                <p className="text-sm">Active: {bundle.isActive ? "Yes" : "No"}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-1/2"
                  onClick={() => editBundle(bundle)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-1/2"
                  onClick={() => deleteBundle.mutate(bundle._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <div className="mt-8 p-6 border rounded-lg shadow-lg bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">{editing ? "Edit Bundle" : "Add New Bundle"}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full mt-4"
        />

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as "bundle" | "subscription" })}
            className="border p-2 rounded w-full"
          >
            <option value="bundle">Bundle</option>
            <option value="subscription">Subscription</option>
          </select>

          <input
            type="text"
            placeholder="Highlight Tag"
            value={form.highlightTag}
            onChange={(e) => setForm({ ...form, highlightTag: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          Active
        </label>

        {/* Features */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Features</h3>
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={f.description}
                onChange={(e) => updateFeature(i, e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <button className="bg-red-500 hover:bg-red-600 text-white px-2 rounded" onClick={() => removeFeature(i)}>
                X
              </button>
            </div>
          ))}
          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded" onClick={addFeature}>
            + Add Feature
          </button>
        </div>

        {/* Pricing */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Pricing Options</h3>
          {form.pricingOptions.map((p, i) => (
            <div key={i} className="flex flex-wrap gap-2 mb-2 items-center">
              <select
                value={p.type}
                onChange={(e) => updatePricing(i, "type", e.target.value)}
                className="border p-2 rounded"
              >
                <option value="one-time">One-Time</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <input
                type="number"
                value={p.price}
                onChange={(e) => updatePricing(i, "price", Number(e.target.value))}
                className="border p-2 rounded w-24"
                placeholder="Price"
              />
              <input
                type="text"
                value={p.currency}
                onChange={(e) => updatePricing(i, "currency", e.target.value)}
                className="border p-2 rounded w-20"
              />
              <input
                type="number"
                placeholder="Duration"
                value={p.durationInMonths || ""}
                onChange={(e) => updatePricing(i, "durationInMonths", Number(e.target.value))}
                className="border p-2 rounded w-24"
              />
              <input
                type="text"
                placeholder="Label"
                value={p.label || ""}
                onChange={(e) => updatePricing(i, "label", e.target.value)}
                className="border p-2 rounded w-24"
              />
              <button className="bg-red-500 hover:bg-red-600 text-white px-2 rounded" onClick={() => removePricing(i)}>
                X
              </button>
            </div>
          ))}
          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded" onClick={addPricing}>
            + Add Pricing
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => saveBundle.mutate(form)}
          >
            {editing ? "Update Bundle" : "Add Bundle"}
          </button>
          {editing && (
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
