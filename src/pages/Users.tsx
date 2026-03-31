import { Users } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AppLayout from "@/layouts/AppLayout"

const rows = [
  "islam anwer",
  "sales6 sales6",
  "sales5 sales5",
  "sales4 sales4",
]

export default function UsersPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[48px] font-semibold tracking-[-0.04em] text-slate-950">Users</h1>
        </div>

        <div className="max-w-sm">
          <Input
            placeholder="Search..."
            className="h-14 rounded-2xl border-slate-200 bg-white px-5 text-[16px] shadow-sm"
          />
        </div>

        <Card className="overflow-hidden rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 pb-4">
            <CardTitle className="flex items-center gap-3 text-[18px] font-medium text-slate-500">
              <Users className="size-5" />
              <span>Name</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {rows.map((row) => (
              <div key={row} className="border-b border-slate-200 px-6 py-6 text-[18px] text-slate-950 last:border-b-0">
                {row}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
