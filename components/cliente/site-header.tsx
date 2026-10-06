"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Catálogo" },
  { href: "/mis-alquileres", label: "Mis alquileres" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-marron text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Brand variant="light" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-primary-foreground"
                    : "text-primary-foreground/75 hover:bg-white/5 hover:text-primary-foreground",
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <Button
            nativeButton={false}
            render={<Link href="/admin" />}
            className="bg-turquesa text-[#26403e] hover:bg-turquesa/85"
          >
            <LayoutDashboard />
            Mostrador
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-primary-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/85 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-lg bg-turquesa px-3 py-2.5 text-sm font-semibold text-[#26403e]"
            >
              <LayoutDashboard className="size-4" />
              Ir al Mostrador / Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
