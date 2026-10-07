"use client"

import { useMemo, useState } from "react"
import { CalendarCheck, CheckCircle2, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { CalendarioDisponibilidad } from "@/components/cliente/calendario-disponibilidad"
import { formatARS, type Equipo } from "@/lib/data"
import { useEquipos } from "@/lib/equipos-context"
import { operativoConfig, stockConfig } from "@/lib/status"
import {
  diasDeRenta,
  fechaLegible,
  horarioDelDia,
  parseISO,
  RESUMEN_HORARIOS,
} from "@/lib/horarios"

export function ReservarPanel({ equipo }: { equipo: Equipo }) {
  const { getEquipo } = useEquipos()
  const precioDia = getEquipo(equipo.id)?.precioDia ?? equipo.precioDia
  const [rango, setRango] = useState<{
    inicio: string | null
    fin: string | null
  }>({ inicio: null, fin: null })
  const [open, setOpen] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const disponible = equipo.stock === "EN_STOCK"
  const stock = stockConfig[equipo.stock]
  const op = operativoConfig[equipo.operatividad]

  const dias = useMemo(
    () => diasDeRenta(rango.inicio ?? "", rango.fin ?? ""),
    [rango.inicio, rango.fin],
  )
  const total = dias * precioDia
  const rangoListo = dias > 0
  const puedeReservar = disponible && rangoListo

  const horarioInicio = rango.inicio
    ? horarioDelDia(parseISO(rango.inicio))
    : null
  const horarioFin = rango.fin ? horarioDelDia(parseISO(rango.fin)) : null

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-display text-2xl font-bold text-foreground">
            {formatARS(precioDia)}
          </p>
          <p className="text-xs text-muted-foreground">por día · IVA incluido</p>
        </div>
        <Badge tone={stock.tone}>{stock.label}</Badge>
      </div>

      {!disponible && (
        <div className="mt-4 flex gap-2 rounded-lg bg-arena/15 p-3 text-sm text-[#4a3327]">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            Actualmente no disponible.
            {equipo.disponibleDesde
              ? ` Fecha probable de liberación: ${equipo.disponibleDesde}.`
              : " Consultá disponibilidad con el mostrador."}
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2 rounded-lg bg-muted/60 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Equipo</span>
          <span className="font-medium text-foreground">{equipo.nombre}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Categoría</span>
          <span className="font-medium text-foreground">{equipo.categoria}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Ubicación</span>
          <span className="font-medium text-foreground">{equipo.ubicacion}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Costo de alquiler</span>
          <span className="font-semibold text-foreground">
            {formatARS(precioDia)} / día
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Badge tone={stock.tone}>{stock.label}</Badge>
          <Badge tone={op.tone}>{op.label}</Badge>
        </div>
      </div>

      <div className="mt-4 flex gap-2 rounded-lg bg-turquesa/15 p-3 text-xs text-[#26403e]">
        <Clock className="mt-0.5 size-4 shrink-0" />
        <p>
          Horario de atención: {RESUMEN_HORARIOS}. Si el mostrador ya cerró hoy,
          no se puede reservar para hoy; para fechas futuras no hay restricción
          de horario.
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Disponibilidad · elegí desde y hasta
        </p>
        <CalendarioDisponibilidad equipo={equipo} rango={rango} onChange={setRango} />
      </div>

      {rangoListo && (
        <div className="mt-4 space-y-1.5 rounded-lg bg-muted/60 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Retiro</span>
            <span className="font-medium text-foreground">
              {fechaLegible(rango.inicio!)}{" "}
              <span className="text-xs text-muted-foreground">
                ({horarioInicio?.abre}–{horarioInicio?.cierra})
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Devolución</span>
            <span className="font-medium text-foreground">
              {fechaLegible(rango.fin!)}{" "}
              <span className="text-xs text-muted-foreground">
                ({horarioFin?.abre}–{horarioFin?.cierra})
              </span>
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>
              {formatARS(precioDia)} × {dias}{" "}
              {dias === 1 ? "día" : "días"}
            </span>
            <span>{formatARS(total)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
            <span>Total estimado</span>
            <span>{formatARS(total)}</span>
          </div>
        </div>
      )}

      {!rangoListo && (
        <p className="mt-4 rounded-lg bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground">
          Seleccioná un rango de fechas en el calendario para estimar el alquiler.
        </p>
      )}

      <Button
        size="lg"
        disabled={!puedeReservar}
        onClick={() => setOpen(true)}
        className="mt-5 w-full"
      >
        <CalendarCheck />
        {rangoListo
          ? `Solicitar pre-reserva · ${dias} ${dias === 1 ? "día" : "días"}`
          : "Solicitar pre-reserva"}
      </Button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        La pre-reserva queda sujeta a autorización del mostrador.
      </p>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
          setEnviado(false)
        }}
        title={enviado ? "Pre-reserva enviada" : "Confirmar pre-reserva"}
        description={
          enviado
            ? undefined
            : "Revisá los datos antes de enviar la solicitud al mostrador."
        }
      >
        {enviado ? (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="size-12 text-success" />
            <p className="mt-3 font-display text-lg font-semibold text-foreground">
              ¡Listo! Recibimos tu solicitud
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              El equipo de mostrador va a validar la disponibilidad de{" "}
              <span className="font-medium text-foreground">
                {equipo.nombre}
              </span>{" "}
              y te confirma en breve. La verás en «Mis alquileres» como
              pre-reserva.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setOpen(false)
                setEnviado(false)
              }}
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg border border-border p-3">
              <img
                src={equipo.imagen || "/placeholder.svg"}
                alt=""
                className="size-14 rounded-md object-cover"
              />
              <div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {equipo.codigo}
                </p>
                <p className="font-medium text-foreground">{equipo.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {equipo.categoria}
                </p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Retiro</dt>
                <dd className="font-medium text-foreground">
                  {fechaLegible(rango.inicio!)} (
                  {horarioInicio?.abre}–{horarioInicio?.cierra})
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Devolución</dt>
                <dd className="font-medium text-foreground">
                  {fechaLegible(rango.fin!)} (
                  {horarioFin?.abre}–{horarioFin?.cierra})
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Duración</dt>
                <dd className="font-medium text-foreground">
                  {dias} {dias === 1 ? "día" : "días"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-bold text-foreground">
                  {formatARS(total)}
                </dd>
              </div>
            </dl>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Volver
              </Button>
              <Button className="flex-1" onClick={() => setEnviado(true)}>
                Enviar solicitud
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}