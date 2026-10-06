import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, MapPin, Wrench, PackageCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ReservarPanel } from "@/components/cliente/reservar-panel"
import { EquipoCard } from "@/components/cliente/equipo-card"
import { EQUIPOS, getEquipo } from "@/lib/data"
import { operativoConfig, stockConfig } from "@/lib/status"

export function generateStaticParams() {
  return EQUIPOS.map((e) => ({ id: e.id }))
}

export default async function EquipoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const equipo = getEquipo(id)
  if (!equipo) notFound()

  const stock = stockConfig[equipo.stock]
  const op = operativoConfig[equipo.operatividad]
  const relacionados = EQUIPOS.filter(
    (e) => e.categoria === equipo.categoria && e.id !== equipo.id,
  ).slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Catálogo
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{equipo.categoria}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={equipo.imagen || "/placeholder.svg"}
              alt={equipo.nombre}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-6">
            <p className="font-mono text-xs text-muted-foreground">
              {equipo.codigo}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-foreground">
              {equipo.nombre}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={stock.tone}>
                <PackageCheck className="size-3.5" />
                {stock.label}
              </Badge>
              <Badge tone={op.tone}>
                <Wrench className="size-3.5" />
                {op.label}
              </Badge>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {equipo.ubicacion}
              </span>
            </div>

            <p className="mt-5 max-w-prose text-pretty leading-relaxed text-muted-foreground">
              {equipo.descripcion}
            </p>

            <h2 className="mt-8 font-display text-lg font-semibold text-foreground">
              Especificaciones
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {equipo.especificaciones.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between bg-card px-4 py-3"
                >
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ReservarPanel equipo={equipo} />
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-foreground">
            Otros equipos de {equipo.categoria}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((e) => (
              <EquipoCard key={e.id} equipo={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
