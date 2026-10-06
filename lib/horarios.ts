import type { Equipo } from "@/lib/data"
import {
  ALQUILERES_ACTIVOS,
  ALQUILERES_CLIENTE,
  PRE_RESERVAS,
} from "@/lib/data"

/**
 * Horario de atención del mostrador:
 * - Lunes a viernes: 09:00 a 18:00
 * - Sábados: 09:00 a 13:00
 * - Domingos y feriados: cerrado
 */

export function horarioDelDia(d: Date): { abre: string; cierra: string } | null {
  if (esFeriado(d)) return null
  const dia = d.getDay()
  if (dia === 0) return null
  if (dia === 6) return { abre: "09:00", cierra: "13:00" }
  return { abre: "09:00", cierra: "18:00" }
}

export const RESUMEN_HORARIOS =
  "Lun a Vie 09:00–18:00 · Sáb 09:00–13:00 · Dom y feriados cerrado"

/** Feriados nacionales de Argentina (prototipo año en curso). */
const FESTIVOS = [
  "01/01",
  "16/02",
  "17/02",
  "02/04",
  "03/04",
  "01/05",
  "25/05",
  "20/06",
  "09/07",
  "17/08",
  "12/10",
  "20/11",
  "08/12",
  "25/12",
]

export function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

export function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d, 12, 0, 0)
}

export function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12, 0, 0)
}

export function hoyInicio() {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 12, 0, 0)
}

export function inicioDeMes(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0)
}

export function diasDelMes(d: Date) {
  const first = inicioDeMes(d)
  const total = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7
  const celdas: Date[] = []
  for (let i = 0; i < offset; i++) celdas.push(addDays(first, i - offset))
  for (let i = 0; i < total; i++) celdas.push(addDays(first, i))
  while (celdas.length % 7 !== 0) celdas.push(addDays(first, celdas.length - offset))
  return celdas
}

export function esFeriado(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return FESTIVOS.includes(`${dd}/${mm}`)
}

function parseDDMM(s: string) {
  const [dd, mm] = s.split("/").map(Number)
  return new Date(new Date().getFullYear(), mm - 1, dd, 12, 0, 0)
}

type Rango = { inicio: Date; fin: Date }

function intervalosOcupados(nombre: string): Rango[] {
  const rangos: Rango[] = []
  const fuentes = [...ALQUILERES_ACTIVOS, ...ALQUILERES_CLIENTE, ...PRE_RESERVAS]
  for (const r of fuentes) {
    if (!r.equipos.includes(nombre)) continue
    if (r.fechaInicio && r.fechaDevolucion) {
      rangos.push({
        inicio: parseDDMM(r.fechaInicio),
        fin: parseDDMM(r.fechaDevolucion),
      })
    }
  }
  return rangos
}

export type EstadoDia = "pasado" | "cerrado" | "ocupado" | "disponible"

/** Si es hoy y ya pasó el cierre del mostrador, no se puede retirar. */
export function sinHorarioParaRetiro(d: Date) {
  const hoy = hoyInicio()
  if (toISODate(d) !== toISODate(hoy)) return false
  const h = horarioDelDia(d)
  if (!h) return true
  const ahora = new Date()
  const ahoraMin = ahora.getHours() * 60 + ahora.getMinutes()
  const [hh, mm] = h.cierra.split(":").map(Number)
  return ahoraMin >= hh * 60 + mm
}

export function estadoDia(equipo: Equipo, d: Date): EstadoDia {
  const hoy = hoyInicio()
  if (d < hoy) return "pasado"
  if (sinHorarioParaRetiro(d)) return "pasado"
  if (!horarioDelDia(d)) return "cerrado"
  if (equipo.stock === "BAJA") return "ocupado"
  if (equipo.stock !== "EN_STOCK" && equipo.disponibleDesde) {
    const liberacion = parseDDMM(equipo.disponibleDesde)
    if (d < liberacion) return "ocupado"
  }
  for (const r of intervalosOcupados(equipo.nombre)) {
    if (d >= r.inicio && d <= r.fin) return "ocupado"
  }
  return "disponible"
}

export function diasDeRenta(inicio: string, fin: string) {
  if (!inicio || !fin) return 0
  const a = parseISO(inicio)
  const b = parseISO(fin)
  if (b < a) return 0
  return Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1
}

export function fechaLegible(iso: string) {
  if (!iso) return ""
  return parseISO(iso).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}