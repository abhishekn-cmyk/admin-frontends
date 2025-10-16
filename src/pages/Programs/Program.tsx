import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2, Plus } from "lucide-react";
import AddProgramModal from "./AddProgram";
import EditProgramModal from "./EditProgram";
import { usePrograms, useDeleteProgram } from "@/hooks/useprogram";

export default function Programs() {
  // Modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  // ===== Fetch Programs via hook =====
  const { data: programs = [], isLoading } = usePrograms();

  // ===== Delete Program Mutation =====
  const { mutate: deleteProgram, isPending: deleting } = useDeleteProgram();

  // ===== Derived Stats for Top 4 Cards =====
  const totalPrograms = programs.length;
  const cpdCount = programs.filter((p: any) => p.category === "CPD").length;
  const mentorshipCount = programs.filter((p: any) => p.category === "Mentorship").length;
  const bundleCount = programs.filter((p: any) => p.category === "CPD & Mentorship").length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Program
        </Button>
      </div>

      {/* ===== Top 4 Summary Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Total Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? "..." : totalPrograms}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>CPD</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? "..." : cpdCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Mentorship</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? "..." : mentorshipCount}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Bundles (CPD & Mentorship)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? "..." : bundleCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* ===== Programs Table ===== */}
      <div className="overflow-x-auto rounded-md shadow">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Subtitle</th>
              <th className="p-3">Pricing Options</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading programs...
                </td>
              </tr>
            ) : (
              programs.map((program: any) => (
                <tr key={program._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{program.title}</td>
                  <td className="p-3">{program.category}</td>
                  <td className="p-3">{program.subtitle || "-"}</td>
                  <td className="p-3">
                    <ul className="list-disc list-inside">
                      {program.pricingOptions.map((opt: any, idx: number) => (
                        <li key={idx}>
                          {opt.name} - {opt.price} {opt.currency}{" "}
                          {opt.perSession ? "/ per session" : ""}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProgram(program);
                        setOpenEdit(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProgram(program._id)}
                      disabled={deleting}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Modals ===== */}
      <AddProgramModal open={openAdd} onOpenChange={setOpenAdd} />
      <EditProgramModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        program={selectedProgram}
        onUpdated={() => {}} // not needed since invalidateQueries is inside hook
      />
    </div>
  );
}
