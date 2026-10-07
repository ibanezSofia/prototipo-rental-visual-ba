import { TrendingUp, Layers, Boxes, Gauge } from "lucide-react"
import {
  alquileresActivos,
  equiposDisponibles,
  formatARS,
  ingresosDelMes,
  ocupacionPromedio,
  variacionMensual,
} from "@/lib/metricas"
import { cn } from "@/lib/utils"

const iconos = {
  ingresos: TrendingUp,
  alquileres: Layers,
  equipos: Boxes,
  ocupacion: Gauge,
} as const

const tonos = {
  ingresos: "bg-verde/12 text-verde",
  alquileres: "bg-turquesa/25 text-[#26403e]",
  equipos: "bg-arena/25 text-[#4a3327]",
  ocupacion: "bg-destructive/12 text-destructive",
} as const

function variaciones() {
  const variacion = variacionMensual()
  const signo = variacion >= 0 ? "+" : ""
  const puntos = ocupacionPromedio().toFixed(0)
  return {
    ingresos: `${signo}${variacion.toFixed(0).replace(".", ",")}% vs. mes anterior`,
    ocupacion: `${puntos}% de la flota alquilada`,
  }
}

export function KpiCards() {
  const { disponibles, total } = equiposDisponibles()
  const activos = alquileresActivos()
  const v = variaciones()

  const metricas = [
    {
      id: "ingresos" as const,
      titulo: "Ingresos del mes",
      valor: formatARS(ingresosDelMes()),
      subtexto: v.ingresos,
    },
    {
      id: "alquileres" as const,
      titulo: "Alquileres activos",
      valor: String(activos),
      subtexto: "en curso ahora",
    },
    {
      id: "equipos" as const,
      titulo: "Equipos disponibles",
      valor: String(disponibles),
      subtexto: `de ${total} en inventario`,
    },
    {
      id: "ocupacion" as const,
      titulo: "Ocupación promedio",
      valor: `${ocupacionPromedio().toFixed(0)}%`,
      subtexto: v.ocupacion,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metricas.map((m) => {
        const Icon = iconos[m.id]
        return (
          <div
            key={m.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-lg",
                  tonos[m.id],
                )}
              >
                <Icon className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-foreground">
              {m.valor}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {m.titulo}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{m.subtexto}</p>
          </div>
        )
      })}
    </div>
  )
}