import { Plus, Pencil, Power, PowerOff, Eye } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import {
  createMarketplaceApi,
  deleteMarketplaceApi,
  toggleMarketplaceStatusApi,
  updateMarketplaceApi,
  type Marketplace,
} from "@/api/marketplaces.api"
import AppLayout from "@/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { ServerDataTable, type ServerDataTableColumn } from "@/components/data-table/server-datatable"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useTranslations } from "@/i18n"

import MarketplaceForm from "./Form"

export default function MarketplacesPage() {
  const t = useTranslations("marketplaces")
  const common = useTranslations("common")
  const [isCreating, setIsCreating] = useState(false)
  const [editingMarketplace, setEditingMarketplace] = useState<Marketplace | null>(null)
  const [viewingMarketplace, setViewingMarketplace] = useState<Marketplace | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const handleCancel = () => {
    setIsCreating(false)
    setEditingMarketplace(null)
    setViewingMarketplace(null)
  }

  const handleSave = async (payload: Partial<Marketplace>) => {
    setIsSaving(true)
    try {
      if (editingMarketplace) {
        const id = editingMarketplace.id ?? editingMarketplace.marketplace_id ?? 0
        await updateMarketplaceApi(id, payload)
        toast.success(common("saved"))
      } else {
        await createMarketplaceApi(payload)
        toast.success(common("saved"))
      }
      setRefreshKey((v) => v + 1)
      handleCancel()
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (marketplace: Marketplace) => {
    try {
      const id = marketplace.id ?? marketplace.marketplace_id ?? 0
      await deleteMarketplaceApi(id)
      toast.success(common("saved"))
      setRefreshKey((v) => v + 1)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete.")
    }
  }

  const handleToggleStatus = async (marketplace: Marketplace) => {
    try {
      const id = marketplace.id ?? marketplace.marketplace_id ?? 0
      await toggleMarketplaceStatusApi(id)
      toast.success(common("saved"))
      setRefreshKey((v) => v + 1)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status.")
    }
  }

  const columns: ServerDataTableColumn<Marketplace>[] = [
    { 
      data: "name", 
      title: t("table.name"),
      render: (row) => row.name || row.marketplace_name || "Unnamed" 
    },
    { 
      data: "url", 
      title: t("table.url"),
      render: (row) => row.url || row.marketplace_url || "-"
    },
    { 
      data: "description", 
      title: "Description",
      render: (row) => <span className="line-clamp-2">{row.description || "---"}</span>
    },
    {
      data: "status",
      title: t("table.status"),
      sortable: false,
      render: (row) => {
        const isActive = Number(row.status) === 1 || row.status === true
        return (
          <div
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              isActive
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                : "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </div>
        )
      }
    },
    {
      data: "created_at",
      title: t("table.createdAt"),
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
    },
    {
      data: null,
      title: t("table.actions"),
      className: "text-center",
      headerClassName: "text-center",
      render: (marketplace) => {
        const isActive = Number(marketplace.status) === 1 || marketplace.status === true
        return (
          <div className="flex w-full items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="View"
              className="h-8 w-8"
              onClick={() => {
                handleCancel()
                setViewingMarketplace(marketplace)
                setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100)
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Edit"
              className="h-8 w-8"
              onClick={() => {
                setEditingMarketplace(marketplace)
                setIsCreating(true)
                setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isActive ? "Deactivate" : "Activate"}
              className={`h-8 w-8 ${isActive ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"}`}
              onClick={() => handleToggleStatus(marketplace)}
            >
              {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <span className="sr-only">Delete</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </Button>
              }
              description={
                <>
                  {t("delete")}: <strong>{marketplace.name || marketplace.marketplace_name}</strong>?
                </>
              }
              onContinue={() => void handleDelete(marketplace)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <AppLayout breadcrumbs={[{ title: t("title"), href: "/marketplaces" }]}>
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
          <h2 className="text-2xl font-semibold">{t("title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <Button
            onClick={() => {
              handleCancel()
              setIsCreating(true)
              setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("add")}
          </Button>
        </div>

        <ServerDataTable<Marketplace>
          prefix="/entity/marketplace"
          columns={columns}
          title={t("title")}
          searchPlaceholder="Search..."
          refreshKey={refreshKey}
        />

        {isCreating || viewingMarketplace ? (
          <div className="mt-4">
            <MarketplaceForm
              key={editingMarketplace ? editingMarketplace.id ?? editingMarketplace.marketplace_id : (viewingMarketplace ? viewingMarketplace.id ?? viewingMarketplace.marketplace_id : "new")}
              marketplace={viewingMarketplace || editingMarketplace}
              isSaving={isSaving}
              isView={!!viewingMarketplace}
              onCancel={handleCancel}
              onSuccess={(payload) => void handleSave(payload)}
            />
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
