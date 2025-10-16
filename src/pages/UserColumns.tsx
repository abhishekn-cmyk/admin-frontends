// src/pages/UserColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { TUser } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const columns: ColumnDef<TUser>[] = [
  { accessorKey: "firstName", header: "First name" },
  { accessorKey: "lastName", header: "Last name" },
  { accessorKey: "email", header: "Email" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const { onEditUser, onDeleteUser } = table.options.meta as {
        onEditUser?: (user: TUser) => void;
        onDeleteUser?: (user: TUser) => void;
      };

      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEditUser?.(user)}>
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDeleteUser?.(user)}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      );
    },
  },
];
