"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Boxes,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Store,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/auth"

const nav = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
  { href: "/admin/pre-reservas", label: "Pre-reservas", icon: ClipboardCheck },
  { href: "/admin/alquileres", label: "Mora", icon: Truck },
]

export function AdminTopbar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    signOut()
    router.replace("/admin/login")
  }

  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 border-b border-border bg-marron px-3 py-2 md:hidden">
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
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-white/15 text-primary-foreground"
                : "text-primary-foreground/70",
            )}
          >
            <n.icon className="size-3.5" />
            {n.label}
          </Link>
        )
      })}
      <div className="ml-auto flex items-center gap-1.5">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-turquesa px-3 py-1.5 text-xs font-semibold text-[#26403e] transition-colors hover:bg-turquesa/85"
        >
          <Store className="size-3.5" />
          Ver portal cliente
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-white/20"
        >
          <LogOut className="size-3.5" />
          Salir
        </button>
      </div>
    </div>
  )
}
