import type { ReactNode } from "react"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"

export const metadata = {
  title: "Mostrador · Rental Visual BA",
}

export default function MostradorLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh bg-background">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </AuthGuard>
  )
}