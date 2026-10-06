import type { EstadoAlquiler, EstadoOperativo, EstadoStock } from "@/lib/data"

export type BadgeTone = "verde" | "turquesa" | "arena" | "gris" | "mora" | "warning"

export const toneClasses: Record<BadgeTone, string> = {
  verde: "bg-verde/12 text-verde border-verde/25",
  turquesa: "bg-turquesa/25 text-[#26403e] border-turquesa/50",
  arena: "bg-arena/25 text-[#4a3327] border-arena/50",
  gris: "bg-gris-calido/15 text-gris-calido border-gris-calido/30",
  mora: "bg-destructive/12 text-destructive border-destructive/30",
  warning: "bg-warning/15 text-warning border-warning/35",
}

export const stockConfig: Record<EstadoStock, { label: string; tone: BadgeTone }> = {
  EN_STOCK: { label: "En stock", tone: "verde" },
  ALQUILADO: { label: "Alquilado", tone: "arena" },
  EN_SERVICIO_TECNICO: { label: "En servicio técnico", tone: "warning" },
  BAJA: { label: "Baja", tone: "gris" },
}

export const operativoConfig: Record<
  EstadoOperativo,
  { label: string; tone: BadgeTone }
> = {
  OPERATIVO: { label: "Operativo", tone: "verde" },
  OPERATIVO_CON_OBSERVACIONES: {
    label: "Operativo con observaciones",
    tone: "warning",
  },
  EN_REPARACION: { label: "En reparación", tone: "mora" },
  SIN_REVISAR: { label: "Sin revisar", tone: "gris" },
}

export const alquilerConfig: Record<
  EstadoAlquiler,
  { label: string; tone: BadgeTone }
> = {
  "PRE-RESERVA": { label: "Pre-reserva", tone: "arena" },
  CONFIRMADA: { label: "Confirmada", tone: "turquesa" },
  EN_CURSO: { label: "En curso", tone: "verde" },
  CERRADA: { label: "Cerrada", tone: "gris" },
}
