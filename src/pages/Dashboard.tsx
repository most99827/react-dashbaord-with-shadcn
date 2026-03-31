import { Activity, Clock3, FolderGit2, GitBranch, Rocket, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AppLayout from "@/layouts/AppLayout"

const breadcrumbs = [{ title: "Dashboard", href: "/home" }]

const repositories = [
  { name: "fleet/core-api", branch: "main", status: "Healthy", updated: "2 min ago" },
  { name: "fleet/booking-web", branch: "release/v1.8", status: "Checks running", updated: "11 min ago" },
  { name: "fleet/mobile-app", branch: "feature/pricing", status: "Review needed", updated: "21 min ago" },
]

const activities = [
  "Sales6 merged pull request #184 into main",
  "Pipeline completed for booking-web deployment",
  "Permission update applied for mobile-app contributors",
]

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-5">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <FolderGit2 className="size-4" /> Repositories
              </CardDescription>
              <CardTitle>24</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <GitBranch className="size-4" /> Active Branches
              </CardDescription>
              <CardTitle>87</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Rocket className="size-4" /> Pipelines Today
              </CardDescription>
              <CardTitle>46</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <ShieldCheck className="size-4" /> Security Alerts
              </CardDescription>
              <CardTitle>2</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Repositories</CardTitle>
                <CardDescription>Latest activity across your projects</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Create Repo
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {repositories.map((repo) => (
                <div
                  key={repo.name}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{repo.name}</p>
                    <p className="text-sm text-muted-foreground">Branch: {repo.branch}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{repo.status}</Badge>
                    <span className="text-xs text-muted-foreground">{repo.updated}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>Live events from workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((item) => (
                <div key={item} className="rounded-lg border p-3">
                  <p className="text-sm">{item}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    just now
                  </div>
                </div>
              ))}

              <div className="rounded-lg border p-3">
                <p className="mb-2 text-sm font-medium">Build Health</p>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[84%] rounded-full bg-emerald-500" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="size-3.5" />
                  84% passing pipelines
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  )
}
