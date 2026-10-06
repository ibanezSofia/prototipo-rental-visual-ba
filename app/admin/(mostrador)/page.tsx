import Link from "next/link"
import {
  Boxes,
  PackageCheck,
  Wrench,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  ALQUILERES_ACTIVOS,
  EQUIPOS,
  PRE_RESERVAS,
} from "@/lib/data"
import { operativoConfig, stockConfig } from "@/lib/status"

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "verde",
}: {
  icon: React.ElementType
  label: string
  value: string | number
  hint?: string
  tone?: "verde" | "turquesa" | "arena" | "mora"
}) {
  const tones = {
    verde: "bg-verde/12 text-verde",
    turquesa: "bg-turquesa/25 text-[#26403e]",
    arena: "bg-arena/25 text-[#4a3327]",
    mora: "bg-destructive/12 text-destructive",
  }
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={`grid size-9 place-items-center rounded-lg ${tones[tone]}`}
        >
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-foreground">
        {value}
      </p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const enStock = EQUIPOS.filter((e) => e.stock === "EN_STOCK").length
  const enServicio = EQUIPOS.filter(
    (e) => e.stock === "EN_SERVICIO_TECNICO",
  ).length
  const requierenAtencion = EQUIPOS.filter(
    (e) => e.operatividad !== "OPERATIVO",
  ).length
  const enMora = ALQUILERES_ACTIVOS.filter((a) => a.mora)
  const preReservasPend = PRE_RESERVAS.length

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Panel de mostrador
        </h1>
        <p className="text-sm text-muted-foreground">
          Estado del inventario, reservas pendientes y devoluciones.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Boxes}
          label="Equipos totales"
          value={EQUIPOS.length}
          hint={`${enStock} disponibles ahora`}
          tone="turquesa"
        />
        <StatCard
          icon={PackageCheck}
          label="En stock"
          value={enStock}
          hint="Listos para alquilar"
          tone="verde"
        />
        <StatCard
          icon={Wrench}
          label="Requieren atención"
          value={requierenAtencion}
          hint={`${enServicio} en servicio técnico`}
          tone="arena"
        />
        <StatCard
          icon={AlertTriangle}
          label="En mora"
          value={enMora.length}
          hint="Devoluciones vencidas"
          tone="mora"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">
              Pre-reservas por autorizar
            </h2>
            <Badge tone="arena">{preReservasPend}</Badge>
          </div>
          <ul className="mt-4 space-y-3">
            {PRE_RESERVAS.slice(0, 3).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {p.cliente}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.equipos.join(", ")}
                  </p>
                </div>
                {p.disponibilidad === "CONFLICTO" ? (
                  <Badge tone="mora">Conflicto</Badge>
                ) : (
                  <Badge tone="verde">Sin conflicto</Badge>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/admin/pre-reservas"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-verde hover:underline"
          >
            <ClipboardCheck className="size-4" />
            Gestionar autorizaciones
            <ArrowRight className="size-3.5" />
          </Link>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-base font-semibold text-foreground">
            Devoluciones en mora
          </h2>
          {enMora.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Sin devoluciones vencidas.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {enMora.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-destructive/8 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {a.cliente}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.equipos.join(", ")} · venció {a.fechaDevolucion}
                    </p>
                  </div>
                  <Badge tone="mora">
                    {a.diasAtraso} {a.diasAtraso === 1 ? "día" : "días"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/alquileres"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-verde hover:underline"
          >
            Ver alquileres activos
            <ArrowRight className="size-3.5" />
          </Link>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-base font-semibold text-foreground">
          Inventario reciente
        </h2>
        <p className="text-xs text-muted-foreground">
          Doble estado: ubicación/stock y operatividad técnica.
        </p>
        <div className="mt-4 space-y-2">
          {EQUIPOS.slice(0, 5).map((e) => {
            const s = stockConfig[e.stock]
            const o = operativoConfig[e.operatividad]
            return (
              <div
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {e.codigo}
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {e.nombre}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone={s.tone}>{s.label}</Badge>
                  <Badge tone={o.tone}>{o.label}</Badge>
                </div>
              </div>
            )
          })}
        </div>
        <Link
          href="/admin/inventario"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-verde hover:underline"
        >
          Ver inventario completo
          <ArrowRight className="size-3.5" />
        </Link>
      </section>
    </div>
  )
}