import DeleteDialog from "@/components/shared/DeleteDialog";
import { useState } from "react";
import PageHeading from "@/layout/PageHeading";
import { TMentorApplication, TSuperAdmin } from "@/types/api";
import { DataTable } from "@/components/shared/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import Toolbar from "@/components/shared/Toolbar";
import { ColumnDef } from "@tanstack/react-table";
import TableLoading from "@/components/shared/TableLoading";
import MentorApplicationForm from "@/components/form/MentorApplicationForm";
import { useDeleteSuperAdmin } from "@/hooks/useSuperAdmin";
import { useMentorApplication } from "@/hooks/useMentorApplication";

export default function MentorApplication() {
  const { data, isLoading } = useMentorApplication();
  const { mutate: handleDeleteMutation } = useDeleteSuperAdmin();
  const [selectedRows, setSelectedRows] = useState<TMentorApplication[]>([]);
  const [modalOpen, setModalOpen] = useState<"none" | "view" | "delete">(
    "none",
  );

  const handleDelete = () => {
    selectedRows.forEach((row) => handleDeleteMutation(row._id ?? ""));
    setSelectedRows([]);
    setModalOpen("none");
  };

  return (
    <>
      <PageHeading
        title="Mentor application"
        description="Manage mentor application"
      />

      {isLoading ? (
        <TableLoading />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          onSelectionChange={setSelectedRows}
        />
      )}

      <MentorApplicationForm
        isOpen={modalOpen === "view"}
        onClose={() => setModalOpen("none")}
        mentorApplication={selectedRows[0]}
      />

      <DeleteDialog
        isOpen={modalOpen === "delete"}
        onClose={() => setModalOpen("none")}
        onConfirm={handleDelete}
      />

      {selectedRows.length > 0 && (
        <Toolbar
          number={selectedRows.length}
          label="mentor application"
          onClose={() => setSelectedRows([])}
          onView={() => setModalOpen("view")}
          onDelete={() => setModalOpen("delete")}
        />
      )}
    </>
  );
}

export const columns: ColumnDef<TSuperAdmin>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "status", header: "Status" },
];
