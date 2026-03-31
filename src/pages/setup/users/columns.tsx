import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

interface UseColumnsProps {
  onParamsChange: (params: never) => void;
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
}

export const useColumns = ({
  onParamsChange,
  handleEdit,
  handleDelete,
}: UseColumnsProps): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              onParamsChange({ sort: "name", direction: "asc" })
            }
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      id: "security_groups",
      header: "Security Groups",
      cell: ({ row }) => {
        const groups = (row.original as any).security_groups || [];
        return (
          <div className="flex flex-wrap gap-1">
            {groups.length > 0 ? (
              groups.map((g: any) => (
                <span key={g.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {g.group_name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">No Groups</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "active_flag",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("active_flag");
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${active
            ? "bg-green-50 text-green-700 ring-green-600/20"
            : "bg-red-50 text-red-700 ring-red-600/10"
            }`}>
            {active ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.getValue("created_at")).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEdit(user)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
              description={
                <>
                  This action cannot be undone. This will
                  permanently delete the user
                  <strong> {user.name}</strong> and remove
                  their data from our servers.
                </>
              }
              onContinue={() => handleDelete(user)}
            />
          </div>
        );
      },
    },
  ];
};
