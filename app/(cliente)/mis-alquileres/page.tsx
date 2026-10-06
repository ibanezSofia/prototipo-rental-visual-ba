import Link from "next/link"
import { Calendar, ArrowRight, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ALQUILERES_CLIENTE, formatARS } from "@/lib/data"
import { alquilerConfig } from "@/lib/status"

export const metadata = {
  title: "Mis alquileres · Rental Visual BA",
}

export default function MisAlquileresPage() {
  const activos = ALQUILERES_CLIENTE.filter((a) => a.estado !== "CERRADA")
  const historial = ALQUILERES_CLIENTE.filter((a) => a.estado === "CERRADA")

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Mis alquileres
        </h1>
        <p className="text-sm text-muted-foreground">
          Seguimiento de tus reservas, alquileres en curso e historial.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Activos y reservas
        </h2>
        <div className="mt-4 space-y-3">
          {activos.map((a) => {
            const cfg = alquilerConfig[a.estado]
            return (
              <article
                key={a.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {a.id}
                      </span>
                      <Badge tone={cfg.tone}>{cfg.label}</Badge>
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                      {a.equipos.map((e) => (
                        <li
                          key={e}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                        >
                          <Package className="size-3.5 text-verde" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-display text-lg font-bold text-foreground">
                    {formatARS(a.total)}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>{a.fechaInicio}</span>
                  <ArrowRight className="size-3.5" />
                  <span>{a.fechaDevolucion}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {historial.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Historial
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            {historial.map((a) => {
              const cfg = alquilerConfig[a.estado]
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-card px-5 py-4 last:border-b-0"
                >
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {a.id}
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {a.equipos.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.fechaInicio} → {a.fechaDevolucion}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatARS(a.total)}
                    </span>
                    <Badge tone={cfg.tone}>{cfg.label}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div className="mt-10 rounded-xl border border-dashed border-border bg-crema-oscuro p-6 text-center">
        <p className="font-display text-lg font-semibold text-foreground">
          ¿Necesitás más equipos?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Explorá el catálogo y sumá equipos a tu próxima producción.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-verde/85"
        >
          Ir al catálogo
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
