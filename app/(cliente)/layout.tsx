import type { ReactNode } from "react"
import { SiteHeader } from "@/components/cliente/site-header"
import { SiteFooter } from "@/components/cliente/site-footer"

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
