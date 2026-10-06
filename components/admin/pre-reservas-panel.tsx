"use client"

import { useState } from "react"
import {
  Check,
  X,
  Calendar,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Inbox,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PRE_RESERVAS, formatARS } from "@/lib/data"

type Decision = "PENDIENTE" | "AUTORIZADA" | "RECHAZADA"

export function PreReservasPanel() {
  const [estado, setEstado] = useState<Record<string, Decision>>(
    Object.fromEntries(PRE_RESERVAS.map((p) => [p.id, "PENDIENTE"])),
  )

  const pendientes = PRE_RESERVAS.filter((p) => estado[p.id] === "PENDIENTE")
  const resueltas = PRE_RESERVAS.filter((p) => estado[p.id] !== "PENDIENTE")

  function decidir(id: string, decision: Decision) {
    setEstado((prev) => ({ ...prev, [id]: decision }))
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Por autorizar
          </h2>
          <Badge tone="arena">{pendientes.length}</Badge>
        </div>

        {pendientes.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-12 text-center">
            <Inbox className="size-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">
              No quedan solicitudes pendientes
            </p>
            <p className="text-xs text-muted-foreground">
              Todas las pre-reservas fueron procesadas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendientes.map((p) => {
              const conflicto = p.disponibilidad === "CONFLICTO"
              return (
                <article
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {p.id}
                        </span>
                        {conflicto ? (
                          <Badge tone="mora">
                            <AlertTriangle className="size-3.5" />
                            Conflicto de fechas
                          </Badge>
                        ) : (
                          <Badge tone="verde">
                            <CheckCircle2 className="size-3.5" />
                            Disponible
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1.5 font-display text-lg font-semibold text-foreground">
                        {p.cliente}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="size-3.5" />
                        {p.contacto}
                      </p>
                    </div>
                    <p className="font-display text-lg font-bold text-foreground">
                      {formatARS(p.total)}
                    </p>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.equipos.map((e) => (
                      <li
                        key={e}
                        className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {e}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    {p.fechaInicio} → {p.fechaDevolucion}
                  </div>

                  {conflicto && (
                    <p className="mt-3 rounded-lg bg-destructive/8 px-3 py-2 text-xs text-destructive">
                      Uno de los equipos solicitados está alquilado en esas
                      fechas. Revisá el calendario antes de autorizar.
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => decidir(p.id, "AUTORIZADA")}
                    >
                      <Check />
                      Autorizar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => decidir(p.id, "RECHAZADA")}
                    >
                      <X />
                      Rechazar
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {resueltas.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Procesadas
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            {resueltas.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 border-b border-border bg-card px-5 py-3.5 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {p.cliente}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.id} · {p.equipos.join(", ")}
                  </p>
                </div>
                {estado[p.id] === "AUTORIZADA" ? (
                  <Badge tone="verde">Autorizada</Badge>
                ) : (
                  <Badge tone="gris">Rechazada</Badge>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
