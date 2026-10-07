"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Search, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORIAS,
  formatARS,
  type Categoria,
  type EstadoOperativo,
  type EstadoStock,
} from "@/lib/data"
import { useEquipos } from "@/lib/equipos-context"
import {
  operativoConfig,
  stockConfig,
  toneClasses,
  type BadgeTone,
} from "@/lib/status"

type Row = {
  id: string
  codigo: string
  nombre: string
  categoria: Categoria
  ubicacion: string
  stock: EstadoStock
  operatividad: EstadoOperativo
  precioDia: number
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

function EstadoSelect({
  value,
  options,
  config,
  ariaLabel,
  onChange,
}: {
  value: string
  options: readonly string[]
  config: Record<string, { label: string; tone: BadgeTone }>
  ariaLabel: string
  onChange: (value: string) => void
}) {
  const current = config[value]
  return (
    <span className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex h-7 cursor-pointer appearance-none items-center gap-1.5 rounded-full border py-0 pl-2.5 pr-7 text-xs font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
          toneClasses[current.tone],
        )}
      >
        {options.map((op) => (
          <option key={op} value={op} className="bg-card text-foreground">
            {config[op].label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2" />
    </span>
  )
}

function PrecioInput({
  value,
  ariaLabel,
  onCommit,
}: {
  value: number
  ariaLabel: string
  onCommit: (value: number) => void
}) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  function commit() {
    const n = Math.round(Number(draft))
    if (Number.isFinite(n) && n >= 0) onCommit(n)
    else setDraft(String(value))
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="relative inline-flex items-center">
        <span className="pointer-events-none absolute left-2.5 text-xs text-muted-foreground">
          $
        </span>
        <input
          type="number"
          min={0}
          step={500}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur()
          }}
          aria-label={ariaLabel}
          className="h-8 w-28 rounded-lg border border-border bg-card pl-6 pr-2 text-right text-sm font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </span>
      <span className="text-[11px] text-muted-foreground">
        {formatARS(value)} por día
      </span>
    </div>
  )
}

export function InventarioTabla() {
  const { equipos, actualizarPrecio } = useEquipos()
  const [rows, setRows] = useState<Row[]>(
    equipos.map((e) => ({
      id: e.id,
      codigo: e.codigo,
      nombre: e.nombre,
      categoria: e.categoria,
      ubicacion: e.ubicacion,
      stock: e.stock,
      operatividad: e.operatividad,
      precioDia: e.precioDia,
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

  function updatePrecio(id: string, precioDia: number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, precioDia } : r)))
    actualizarPrecio(id, precioDia)
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
              <th className="px-4 py-3 font-semibold">Precio / día</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Operatividad</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
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
                    <PrecioInput
                      value={r.precioDia}
                      ariaLabel={`Cambiar precio de ${r.nombre}`}
                      onCommit={(v) => updatePrecio(r.id, v)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <EstadoSelect
                      value={r.stock}
                      options={stockOpciones}
                      config={stockConfig}
                      ariaLabel={`Cambiar stock de ${r.nombre}`}
                      onChange={(v) =>
                        update(r.id, { stock: v as EstadoStock })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <EstadoSelect
                      value={r.operatividad}
                      options={operativoOpciones}
                      config={operativoConfig}
                      ariaLabel={`Cambiar operatividad de ${r.nombre}`}
                      onChange={(v) =>
                        update(r.id, { operatividad: v as EstadoOperativo })
                      }
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-3 lg:hidden">
        {filtered.map((r) => {
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

              <div className="mt-3 flex flex-col items-start gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Precio / día
                </span>
                <PrecioInput
                  value={r.precioDia}
                  ariaLabel={`Cambiar precio de ${r.nombre}`}
                  onCommit={(v) => updatePrecio(r.id, v)}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex min-w-0 flex-col items-start gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Stock
                  </span>
                  <EstadoSelect
                    value={r.stock}
                    options={stockOpciones}
                    config={stockConfig}
                    ariaLabel={`Cambiar stock de ${r.nombre}`}
                    onChange={(v) => update(r.id, { stock: v as EstadoStock })}
                  />
                </div>
                <div className="flex min-w-0 flex-col items-start gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Operatividad
                  </span>
                  <EstadoSelect
                    value={r.operatividad}
                    options={operativoOpciones}
                    config={operativoConfig}
                    ariaLabel={`Cambiar operatividad de ${r.nombre}`}
                    onChange={(v) =>
                      update(r.id, { operatividad: v as EstadoOperativo })
                    }
                  />
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
