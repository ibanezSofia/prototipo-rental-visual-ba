import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatARS, type Equipo } from "@/lib/data"
import { operativoConfig, stockConfig } from "@/lib/status"

export function EquipoCard({ equipo }: { equipo: Equipo }) {
  const stock = stockConfig[equipo.stock]
  const op = operativoConfig[equipo.operatividad]
  const disponible = equipo.stock === "EN_STOCK"

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/equipo/${equipo.id}`}
        className="relative aspect-[4/3] overflow-hidden bg-muted"
      >
        <Image
          src={equipo.imagen || "/placeholder.svg"}
          alt={equipo.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3">
          <Badge tone="gris" className="bg-card/90 backdrop-blur">
            {equipo.categoria}
          </Badge>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {equipo.codigo}
            </p>
            <h3 className="font-display text-base font-semibold leading-tight text-foreground">
              {equipo.nombre}
            </h3>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-verde" />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone={stock.tone}>{stock.label}</Badge>
          <Badge tone={op.tone}>{op.label}</Badge>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {equipo.ubicacion}
          {!disponible && equipo.disponibleDesde && (
            <span className="ml-auto text-arena">
              Libre {equipo.disponibleDesde}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="font-display text-lg font-bold text-foreground">
              {formatARS(equipo.precioDia)}
            </p>
            <p className="text-[11px] text-muted-foreground">por día</p>
          </div>
          <Link
            href={`/equipo/${equipo.id}`}
            className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-verde hover:text-primary-foreground"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </Card>
  )
}
