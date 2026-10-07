"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { EquipoCard } from "@/components/cliente/equipo-card"
import { CATEGORIAS, type Categoria } from "@/lib/data"
import { useEquipos } from "@/lib/equipos-context"
import { cn } from "@/lib/utils"

type Filtro = "TODOS" | Categoria

export function Catalogo() {
  const { equipos } = useEquipos()
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<Filtro>("TODOS")
  const [soloDisponibles, setSoloDisponibles] = useState(false)

  const resultados = useMemo(() => {
    return equipos.filter((e) => {
      const matchCat = cat === "TODOS" || e.categoria === cat
      const matchQ =
        q.trim() === "" ||
        e.nombre.toLowerCase().includes(q.toLowerCase()) ||
        e.codigo.toLowerCase().includes(q.toLowerCase())
      const matchDisp = !soloDisponibles || e.stock === "EN_STOCK"
      return matchCat && matchQ && matchDisp
    })
  }, [equipos, q, cat, soloDisponibles])

  const chips: Filtro[] = ["TODOS", ...CATEGORIAS]

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Catálogo de equipos
            </h2>
            <p className="text-sm text-muted-foreground">
              {resultados.length} equipos · estado de stock y operatividad en
              tiempo real
            </p>
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre o código…"
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                cat === c
                  ? "border-verde bg-verde text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-verde/40 hover:text-foreground",
              )}
            >
              {c === "TODOS" ? "Todos" : c}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSoloDisponibles((v) => !v)}
            className={cn(
              "ml-auto inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              soloDisponibles
                ? "border-turquesa bg-turquesa text-[#26403e]"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            Solo disponibles
          </button>
        </div>
      </div>

      {resultados.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            Sin resultados
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Probá con otro término o quitá los filtros.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((e) => (
            <EquipoCard key={e.id} equipo={e} />
          ))}
        </div>
      )}
    </section>
  )
}
