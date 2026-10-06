"use client"

import { useMemo, useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  CATEGORIAS,
  EQUIPOS,
  type Categoria,
  type EstadoOperativo,
  type EstadoStock,
} from "@/lib/data"
import { operativoConfig, stockConfig } from "@/lib/status"

type Row = {
  id: string
  codigo: string
  nombre: string
  categoria: Categoria
  ubicacion: string
  stock: EstadoStock
  operatividad: EstadoOperativo
}

const stockOpciones: EstadoStock[] = [
  "EN_STOCK",
  "ALQUILADO",
  "EN_SERVICIO_TECNICO",
  "BAJA",
]
const operativoOpciones: EstadoOperativo[] = [
  "OPERATIVO",
  "OPERATIVO_CON_OBSERVACIONES",
  "EN_REPARACION",
  "SIN_REVISAR",
]

export function InventarioTabla() {
  const [rows, setRows] = useState<Row[]>(
    EQUIPOS.map((e) => ({
      id: e.id,
      codigo: e.codigo,
      nombre: e.nombre,
      categoria: e.categoria,
      ubicacion: e.ubicacion,
      stock: e.stock,
      operatividad: e.operatividad,
    })),
  )
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<Categoria | "Todas">("Todas")

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return rows.filter((r) => {
      const okCat = cat === "Todas" || r.categoria === cat
      const okQ =
        !t ||
        r.nombre.toLowerCase().includes(t) ||
        r.codigo.toLowerCase().includes(t)
      return okCat && okQ
    })
  }, [rows, q, cat])

  function update(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o código…"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["Todas", ...CATEGORIAS] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                cat === c
                  ? "border-verde bg-verde text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border lg:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Equipo</th>
              <th className="px-4 py-3 font-semibold">Ubicación</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Operatividad</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const s = stockConfig[r.stock]
              const o = operativoConfig[r.operatividad]
              return (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {r.codigo}
                    </p>
                    <p className="font-medium text-foreground">{r.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.categoria}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {r.ubicacion}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Badge tone={s.tone}>{s.label}</Badge>
                      <select
                        value={r.stock}
                        onChange={(e) =>
                          update(r.id, {
                            stock: e.target.value as EstadoStock,
                          })
                        }
                        className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus-visible:border-ring"
                        aria-label={`Cambiar stock de ${r.nombre}`}
                      >
                        {stockOpciones.map((op) => (
                          <option key={op} value={op}>
                            {stockConfig[op].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Badge tone={o.tone}>{o.label}</Badge>
                      <select
                        value={r.operatividad}
                        onChange={(e) =>
                          update(r.id, {
                            operatividad: e.target.value as EstadoOperativo,
                          })
                        }
                        className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus-visible:border-ring"
                        aria-label={`Cambiar operatividad de ${r.nombre}`}
                      >
                        {operativoOpciones.map((op) => (
                          <option key={op} value={op}>
                            {operativoConfig[op].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-3 lg:hidden">
        {filtered.map((r) => {
          const s = stockConfig[r.stock]
          const o = operativoConfig[r.operatividad]
          return (
            <div
              key={r.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {r.codigo}
                  </p>
                  <p className="font-medium text-foreground">{r.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.categoria}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {r.ubicacion}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Stock
                  </span>
                  <Badge tone={s.tone} className="whitespace-normal text-left">
                    {s.label}
                  </Badge>
                  <select
                    value={r.stock}
                    onChange={(e) =>
                      update(r.id, {
                        stock: e.target.value as EstadoStock,
                      })
                    }
                    className="h-8 w-full rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus-visible:border-ring"
                    aria-label={`Cambiar stock de ${r.nombre}`}
                  >
                    {stockOpciones.map((op) => (
                      <option key={op} value={op}>
                        {stockConfig[op].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Operatividad
                  </span>
                  <Badge tone={o.tone} className="whitespace-normal text-left">
                    {o.label}
                  </Badge>
                  <select
                    value={r.operatividad}
                    onChange={(e) =>
                      update(r.id, {
                        operatividad: e.target.value as EstadoOperativo,
                      })
                    }
                    className="h-8 w-full rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus-visible:border-ring"
                    aria-label={`Cambiar operatividad de ${r.nombre}`}
                  >
                    {operativoOpciones.map((op) => (
                      <option key={op} value={op}>
                        {operativoConfig[op].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No se encontraron equipos con esos filtros.
        </p>
      )}
    </div>
  )
}
