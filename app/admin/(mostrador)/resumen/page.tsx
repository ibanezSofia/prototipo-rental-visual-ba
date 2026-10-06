import { KpiCards } from "@/components/admin/kpi-cards"
import { IngresosCard } from "@/components/admin/ingresos-chart"
import { OcupacionCard } from "@/components/admin/ocupacion-card"

export const metadata = {
  title: "Resumen · Mostrador",
}

export default function ResumenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Resumen
        </h1>
        <p className="text-sm text-muted-foreground">
          Métricas, ingresos y ocupación del mes.
        </p>
      </header>

      <div className="mt-6">
        <KpiCards />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <IngresosCard />
        <OcupacionCard />
      </div>
    </div>
  )
}