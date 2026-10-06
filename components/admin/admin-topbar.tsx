"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, ClipboardCheck, LayoutDashboard, Store, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
  { href: "/admin/pre-reservas", label: "Pre-reservas", icon: ClipboardCheck },
  { href: "/admin/alquileres", label: "Mora", icon: Truck },
]

export function AdminTopbar() {
  const pathname = usePathname()
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
      <Link
        href="/"
        className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-turquesa px-3 py-1.5 text-xs font-semibold text-[#26403e] transition-colors hover:bg-turquesa/85"
      >
        <Store className="size-3.5" />
        Ver portal cliente
      </Link>
    </div>
  )
}
