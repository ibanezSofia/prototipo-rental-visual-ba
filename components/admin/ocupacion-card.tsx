import { ocupacionPorEquipo } from "@/lib/metricas"

export function OcupacionCard() {
  const equipos = ocupacionPorEquipo()

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-display text-base font-semibold text-foreground">
        Ocupación por equipo
      </h2>
      <p className="text-xs text-muted-foreground">
        Equipos con mayor demanda histórica
      </p>

      <ul className="mt-5 space-y-4">
        {equipos.map((e) => (
          <li key={e.nombre}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{e.nombre}</span>
              <span className="text-xs text-muted-foreground">
                {e.operaciones} operaciones
              </span>
              <span className="font-display font-bold text-foreground">
                {e.porcentaje}%
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-verde transition-all"
                style={{ width: `${e.porcentaje}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}