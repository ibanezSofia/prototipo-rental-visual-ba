"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Boxes,
  ClipboardCheck,
  Truck,
  Store,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/auth"

const nav = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
  { href: "/admin/pre-reservas", label: "Pre-reservas", icon: ClipboardCheck },
  { href: "/admin/alquileres", label: "Alquileres y mora", icon: Truck },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    signOut()
    router.replace("/admin/login")
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <span className="grid size-8 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Store className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">Mostrador</p>
          <p className="text-[11px] text-sidebar-foreground/60">
            Rental Visual BA
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((n) => {
          const active =
            n.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(n.href)
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <n.icon className="size-4" />
              {n.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <Store className="size-4" />
          Ver portal cliente
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
