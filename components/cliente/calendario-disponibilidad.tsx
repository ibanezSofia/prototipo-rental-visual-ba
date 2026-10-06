"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Equipo } from "@/lib/data"
import {
  diasDelMes,
  estadoDia,
  fechaLegible,
  hoyInicio,
  inicioDeMes,
  parseISO,
  toISODate,
  type EstadoDia,
} from "@/lib/horarios"

export type RangoFechas = { inicio: string | null; fin: string | null }

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export function CalendarioDisponibilidad({
  equipo,
  rango,
  onChange,
}: {
  equipo: Equipo
  rango: RangoFechas
  onChange: (r: RangoFechas) => void
}) {
  const hoy = hoyInicio()
  const [mes, setMes] = useState(inicioDeMes(hoy))
  const [dir, setDir] = useState<"next" | "prev">("next")
  const [hover, setHover] = useState<string | null>(null)

  const start = rango.inicio ? parseISO(rango.inicio) : null
  const end = rango.fin ? parseISO(rango.fin) : null
  const rangoEnd = end ?? (start && hover ? parseISO(hover) : null)

  const celdas = diasDelMes(mes)
  const keyMes = toISODate(inicioDeMes(mes))
  const prevDisabled = inicioDeMes(mes).getTime() <= inicioDeMes(hoy).getTime()
  const tituloMes = (
    <span className="font-display text-sm font-semibold text-foreground">
      {MESES[mes.getMonth()]}{" "}
      <span className="text-xs font-normal text-muted-foreground">
        {mes.getFullYear()}
      </span>
    </span>
  )

  function cambiarMes(delta: number) {
    const siguiente = new Date(mes.getFullYear(), mes.getMonth() + delta, 1, 12)
    setDir(delta > 0 ? "next" : "prev")
    setMes(siguiente)
    setHover(null)
  }

  function handleClick(iso: string) {
    const d = parseISO(iso)
    if (estadoDia(equipo, d) !== "disponible") return
    if (!start) {
      onChange({ inicio: iso, fin: null })
    } else if (!end) {
      if (d >= start) onChange({ inicio: rango.inicio, fin: iso })
      else onChange({ inicio: iso, fin: null })
    } else {
      onChange({ inicio: iso, fin: null })
    }
  }

  function styleDia(iso: string, estado: EstadoDia) {
    const d = parseISO(iso)
    const enRango = start && rangoEnd && d >= start && d <= rangoEnd
    const esExtremo = enRango && toISODate(start) === iso
    const esFin = enRango && rangoEnd && toISODate(rangoEnd) === iso

    if (enRango) {
      return cn(
        "bg-verde/25 text-verde",
        esExtremo || esFin
          ? "bg-verde font-semibold text-primary-foreground shadow-sm"
          : "rounded-none",
      )
    }
    if (estado === "disponible")
      return "cursor-pointer text-foreground hover:bg-verde/30 hover:text-verde"
    if (estado === "cerrado")
      return "bg-muted/70 text-[11px] font-medium tracking-tight text-gris-calido/60"
    if (estado === "ocupado") return "bg-arena/15 text-muted-foreground/70"
    return "text-muted-foreground/35"
  }

  function etiqueta(iso: string, estado: EstadoDia) {
    if (estado === "disponible") return `Disponible · ${fechaLegible(iso)}`
    if (estado === "cerrado") return "Cerrado"
    if (estado === "ocupado") return "Sin disponibilidad"
    if (iso === toISODate(hoy)) return "Hoy ya cerró el mostrador"
    return ""
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Mes anterior"
          disabled={prevDisabled}
          onClick={() => cambiarMes(-1)}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        {tituloMes}
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => cambiarMes(1)}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div
        key={keyMes}
        className={cn(
          "mt-3 grid grid-cols-7 gap-1 text-center",
          dir === "next"
            ? "animate-deslizar-siguiente"
            : "animate-deslizar-anterior",
        )}
      >
        {DIAS_SEMANA.map((d) => (
          <span
            key={d}
            className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {d}
          </span>
        ))}
        {celdas.map((d) => {
          const iso = toISODate(d)
          const estado = estadoDia(equipo, d)
          return (
            <button
              key={iso}
              type="button"
              disabled={estado !== "disponible"}
              title={etiqueta(iso, estado)}
              onMouseEnter={() => setHover(iso)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleClick(iso)}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg text-xs tabular-nums transition-colors",
                styleDia(iso, estado),
              )}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-verde/25" />
          Rango elegido
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-muted/70" />
          Cerrado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-arena/15" />
          Ocupado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-verde" />
          Inicio / Fin
        </span>
      </div>

      {start && rangoEnd && (
        <p className="mt-3 rounded-lg bg-verde/10 px-3 py-2 text-xs font-medium text-verde">
          {fechaLegible(rango.inicio!)} → {fechaLegible(toISODate(rangoEnd))}
        </p>
      )}
    </div>
  )
}