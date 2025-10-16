import DeleteDialog from "@/components/shared/DeleteDialog";
import { useState } from "react";
import PageHeading from "@/layout/PageHeading";
import { TPricing } from "@/types/api";
import { DataTable } from "@/components/shared/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import Toolbar from "@/components/shared/Toolbar";
import { ColumnDef } from "@tanstack/react-table";
import TableLoading from "@/components/shared/TableLoading";
import PricingForm from "@/components/form/PricingForm";
import { useDeletePricing, usePricing } from "@/hooks/usePricing";

export default function Pricing() {
  const { data, isLoading } = usePricing();
  const { mutate: handleDeleteMutation } = useDeletePricing();
  const [selectedRows, setSelectedRows] = useState<TPricing[]>([]);
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
        title="Pricing"
        description="Manage pricing"
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

      <PricingForm
        isOpen={modalOpen === "view" || modalOpen === "new"}
        onClose={() => setModalOpen("none")}
        pricing={selectedRows[0]}
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

export const columns: ColumnDef<TPricing>[] = [
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
    accessorKey: "title",
    header: "Title",
  },
    {
    accessorKey: "subTitle",
    header: "Subtitle",
  },{
    accessorKey: "popular",
    header: "Popular",
  },
   {
    accessorKey: "order",
    header: "Order",
  },
  { accessorKey: "publish", header: "Publish" },
];
