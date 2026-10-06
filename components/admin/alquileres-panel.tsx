"use client"

import { useState } from "react"
import {
  Calendar,
  AlertTriangle,
  PackageCheck,
  User,
  RotateCcw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { ALQUILERES_ACTIVOS, formatARS, type Alquiler } from "@/lib/data"
import { operativoConfig, type BadgeTone } from "@/lib/status"
import type { EstadoOperativo } from "@/lib/data"

const operativoOpciones: EstadoOperativo[] = [
  "OPERATIVO",
  "OPERATIVO_CON_OBSERVACIONES",
  "EN_REPARACION",
]

export function AlquileresPanel() {
  const [cerrados, setCerrados] = useState<string[]>([])
  const [activo, setActivo] = useState<Alquiler | null>(null)
  const [condicion, setCondicion] = useState<EstadoOperativo>("OPERATIVO")

  const visibles = ALQUILERES_ACTIVOS.filter((a) => !cerrados.includes(a.id))
  const enMora = visibles.filter((a) => a.mora).length

  function abrirDevolucion(a: Alquiler) {
    setActivo(a)
    setCondicion("OPERATIVO")
  }

  function confirmarDevolucion() {
    if (activo) setCerrados((prev) => [...prev, activo.id])
    setActivo(null)
  }

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-display text-2xl font-bold text-foreground">
            {visibles.length}
          </p>
          <p className="text-xs text-muted-foreground">Alquileres en curso</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-display text-2xl font-bold text-destructive">
            {enMora}
          </p>
          <p className="text-xs text-muted-foreground">En mora</p>
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card py-12 text-center text-sm text-muted-foreground">
          No hay alquileres en curso. Todas las devoluciones fueron registradas.
        </p>
      ) : (
        <div className="space-y-4">
          {visibles.map((a) => {
            const tone: BadgeTone = a.mora ? "mora" : "verde"
            return (
              <article
                key={a.id}
                className={`rounded-xl border bg-card p-5 shadow-sm ${
                  a.mora ? "border-destructive/40" : "border-border"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {a.id}
                    </span>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 font-display text-base font-semibold text-foreground">
                      <User className="size-4 text-muted-foreground" />
                      {a.cliente}
                    </p>
                  </div>
                  <Badge tone={tone}>
                    {a.mora ? (
                      <>
                        <AlertTriangle className="size-3.5" />
                        Mora · {a.diasAtraso}{" "}
                        {a.diasAtraso === 1 ? "día" : "días"}
                      </>
                    ) : (
                      "En curso"
                    )}
                  </Badge>
                </div>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {a.equipos.map((e) => (
                    <li
                      key={e}
                      className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {e}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    {a.fechaInicio} → devolución {a.fechaDevolucion}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatARS(a.total)}
                    </span>
                    <Button size="sm" onClick={() => abrirDevolucion(a)}>
                      <RotateCcw />
                      Registrar devolución
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal
        open={activo !== null}
        onClose={() => setActivo(null)}
        title="Registrar devolución"
        description="Confirmá la condición técnica de los equipos al ingresarlos."
      >
        {activo && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-3">
              <p className="font-mono text-[11px] text-muted-foreground">
                {activo.id}
              </p>
              <p className="font-medium text-foreground">{activo.cliente}</p>
              <ul className="mt-2 space-y-1">
                {activo.equipos.map((e) => (
                  <li
                    key={e}
                    className="inline-flex items-center gap-1.5 text-sm text-foreground"
                  >
                    <PackageCheck className="size-3.5 text-verde" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            {activo.mora && (
              <p className="rounded-lg bg-destructive/8 px-3 py-2 text-xs text-destructive">
                Devolución con {activo.diasAtraso}{" "}
                {activo.diasAtraso === 1 ? "día" : "días"} de atraso. Puede
                aplicarse recargo por mora.
              </p>
            )}

            <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              Condición al recibir
              <select
                value={condicion}
                onChange={(e) =>
                  setCondicion(e.target.value as EstadoOperativo)
                }
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                {operativoOpciones.map((op) => (
                  <option key={op} value={op}>
                    {operativoConfig[op].label}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-muted-foreground">
                Si el equipo requiere revisión, quedará marcado en el inventario
                como no disponible.
              </span>
            </label>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setActivo(null)}
              >
                Cancelar
              </Button>
              <Button className="flex-1" onClick={confirmarDevolucion}>
                Confirmar ingreso
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
