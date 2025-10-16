import DeleteDialog from "@/components/shared/DeleteDialog";
import { useState } from "react";
import PageHeading from "@/layout/PageHeading";
import { TSuperAdmin } from "@/types/api";
import { DataTable } from "@/components/shared/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import Toolbar from "@/components/shared/Toolbar";
import { ColumnDef } from "@tanstack/react-table";
import TableLoading from "@/components/shared/TableLoading";
import SuperAdminForm from "@/components/form/SuperAdminForm";
import { useDeleteSuperAdmin, useSuperAdmin } from "@/hooks/useSuperAdmin";

export default function SuperAdmin() {
  const { data, isLoading } = useSuperAdmin();
  const { mutate: handleDeleteMutation } = useDeleteSuperAdmin();
  const [selectedRows, setSelectedRows] = useState<TSuperAdmin[]>([]);
  const [modalOpen, setModalOpen] = useState<
    "none" | "new" | "view" | "delete"
  >("none");

  const handleDelete = () => {
    selectedRows.forEach((row) => handleDeleteMutation(row._id ?? ""));
    setSelectedRows([]);
    setModalOpen("none");
  };

  return (
    <>
      <PageHeading
        title="Super admin"
        description="Manage super admin"
        onClick={() => setModalOpen("new")}
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

      <SuperAdminForm
        isOpen={modalOpen === "view" || modalOpen === "new"}
        onClose={() => setModalOpen("none")}
        superAdmin={selectedRows[0]}
      />

      <DeleteDialog
        isOpen={modalOpen === "delete"}
        onClose={() => setModalOpen("none")}
        onConfirm={handleDelete}
      />

      {selectedRows.length > 0 && (
        <Toolbar
          number={selectedRows.length}
          label="testimonial"
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
    accessorKey: "name",
    header: "Name",
  },
  { accessorKey: "email", header: "Email" },
];
