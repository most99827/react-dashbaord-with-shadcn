import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

import {
  createSecurityGroupApi,
  deleteSecurityGroupApi,
  getPrivilegesApi,
  updateSecurityGroupApi,
  type SysAdminGroup,
} from "@/api/security-groups.api"
import AppLayout from "@/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { ServerDataTable, type ServerDataTableColumn } from "@/components/data-table/server-datatable"
import { ConfirmDialog } from "@/components/confirm-dialog"

import GroupForm, { buildPrivilegeObject, type AvailablePrivileges } from "./GroupForm"

export default function SecurityGroupsPage() {
  const [availablePrivileges, setAvailablePrivileges] = useState<AvailablePrivileges>({})
  const [isCreating, setIsCreating] = useState(false)
  const [editingGroup, setEditingGroup] = useState<SysAdminGroup | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadPrivileges = async () => {
    try {
      const privilegesResponse = await getPrivilegesApi()
      setAvailablePrivileges(privilegesResponse.data.data ?? {})
    } catch (err: any) {
      console.error(err)
    }
  }

  useEffect(() => {
    void loadPrivileges()
  }, [])

  const handleCancel = () => {
    setIsCreating(false)
    setEditingGroup(null)
  }

  const handleSave = async ({ group_name, privilegeKeys }: { group_name: string; privilegeKeys: string[] }) => {
    const payload = { group_name, privilege: buildPrivilegeObject(privilegeKeys) }
    if (editingGroup) {
      await updateSecurityGroupApi(editingGroup.id, payload)
    } else {
      await createSecurityGroupApi(payload)
    }
    setRefreshKey((v) => v + 1)
    handleCancel()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: number) => {
    await deleteSecurityGroupApi(id)
    setRefreshKey((v) => v + 1)
  }

  const columns: ServerDataTableColumn<SysAdminGroup>[] = [
    { data: "group_name", title: "Group" },
    {
      data: "created_at",
      title: "Creation Date",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      data: null,
      title: "Actions",
      className: "text-right",
      render: (group) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingGroup(group)
              setIsCreating(true)
              setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100)
            }}
          >
            Edit
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="outline" size="sm">
                Delete
              </Button>
            }
            description={
              <>
                This action cannot be undone. Delete
                <strong> {group.group_name}</strong>?
              </>
            }
            onContinue={() => void handleDelete(group.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <AppLayout breadcrumbs={[{ title: "Security Groups", href: "/setup/groups" }]}>
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Security Groups</h2>
          <Button
            onClick={() => {
              handleCancel()
              setIsCreating(true)
              setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Group
          </Button>
        </div>

        <ServerDataTable<SysAdminGroup>
          prefix="/sys/admin-groups"
          columns={columns}
          title="Groups"
          searchPlaceholder="Search..."
          refreshKey={refreshKey}
        />

        {isCreating ? (
          <GroupForm
            key={editingGroup ? editingGroup.id : "new"}
            group={editingGroup}
            availablePrivileges={availablePrivileges}
            onCancel={handleCancel}
            onSuccess={(payload) => void handleSave(payload)}
          />
        ) : null}
      </div>
    </AppLayout>
  )
}
