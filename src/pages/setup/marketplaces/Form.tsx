import { useState, useEffect } from "react"
import { Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { Marketplace } from "@/api/marketplaces.api"

type MarketplaceFormProps = {
  marketplace: Marketplace | null
  isSaving?: boolean
  isView?: boolean
  onSuccess?: (payload: Partial<Marketplace>) => void
  onCancel: () => void
}

export default function MarketplaceForm({
  marketplace,
  isSaving = false,
  isView = false,
  onSuccess,
  onCancel,
}: MarketplaceFormProps) {
  const isEdit = !!marketplace

  const [name, setName] = useState(marketplace?.name ?? marketplace?.marketplace_name ?? "")
  const [url, setUrl] = useState(marketplace?.url ?? marketplace?.marketplace_url ?? "")
  const [description, setDescription] = useState(marketplace?.description ?? "")
  // Normalize status as boolean for the switch component
  const initialState = typeof marketplace?.status === "boolean" 
    ? marketplace.status 
    : (Number(marketplace?.status) === 1)

  const [status, setStatus] = useState(marketplace ? initialState : true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (marketplace) {
      setName(marketplace.name ?? marketplace.marketplace_name ?? "")
      setUrl(marketplace.url ?? marketplace.marketplace_url ?? "")
      setDescription(marketplace.description ?? "")
      setStatus(
        typeof marketplace.status === "boolean" 
          ? marketplace.status 
          : (Number(marketplace.status) === 1)
      )
      setErrors({})
    }
  }, [marketplace])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Marketplace name is required."
    if (!url.trim()) newErrors.url = "Marketplace URL is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    if (onSuccess) {
      onSuccess({
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        status: status ? 1 : 0
      })
    }
  }

  return (
    <Card className="mt-8 border shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{isView ? "View Marketplace" : (isEdit ? "Edit Marketplace" : "Create Marketplace")}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={isSaving}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form id="marketplace-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Marketplace Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                  }}
                  placeholder="e.g. Amazon, BestBuy"
                  className={errors.name ? "border-destructive" : ""}
                  disabled={isView}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">
                  Marketplace URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    if (errors.url) setErrors((prev) => ({ ...prev, url: "" }))
                  }}
                  placeholder="https://example.com"
                  className={errors.url ? "border-destructive" : ""}
                  disabled={isView}
                />
                {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description..."
                  className="min-h-[105px]"
                  disabled={isView}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable this marketplace.
                  </p>
                </div>
                <Switch
                  checked={status}
                  onCheckedChange={setStatus}
                  disabled={isView}
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t bg-muted/30 px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isView ? "Close" : "Cancel"}
        </Button>
        {!isView && (
          <Button 
            type="submit" 
            form="marketplace-form"
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : (isEdit ? "Update Marketplace" : "Save Marketplace")}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}