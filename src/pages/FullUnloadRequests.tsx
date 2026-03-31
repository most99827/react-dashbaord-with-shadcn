import AppLayout from "@/layouts/AppLayout"

export default function FullUnloadRequestsPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-[48px] font-semibold tracking-[-0.04em] text-slate-950">Full Unload Van</h1>
        <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[18px] text-slate-600">Static full unload requests page using the same Laravel-style shell.</p>
        </div>
      </div>
    </AppLayout>
  )
}
