import {
  ALQUILERES_ACTIVOS,
  ALQUILERES_HISTORIAL,
  EQUIPOS,
  MESES_HISTORICO,
  formatARS,
} from "@/lib/data"

const mesActualKey = MESES_HISTORICO[MESES_HISTORICO.length - 1].key
const mesAnteriorKey = MESES_HISTORICO[MESES_HISTORICO.length - 2].key

export type OcupacionEquipo = {
  nombre: string
  operaciones: number
  porcentaje: number
}

export type IngresosSerie = {
  etiquetas: string[]
  valores: number[]
  variacionGlobal: string
}

export function ingresosDelMes() {
  return ALQUILERES_HISTORIAL.filter((r) => r.mes === mesActualKey).reduce(
    (acc, r) => acc + r.total,
    0,
  )
}

function totalDelMes(mes: string) {
  return ALQUILERES_HISTORIAL.filter((r) => r.mes === mes).reduce(
    (acc, r) => acc + r.total,
    0,
  )
}

/** Variación % entre el mes anterior y el actual */
export function variacionMensual() {
  const anterior = totalDelMes(mesAnteriorKey)
  const actual = ingresosDelMes()
  if (anterior === 0) return 0
  return ((actual - anterior) / anterior) * 100
}

/** Serie mensual completa + variación global del período */
export function ingresosMensuales(): IngresosSerie {
  const etiquetas = MESES_HISTORICO.map((m) => m.etiqueta)
  const valores = MESES_HISTORICO.map((m) => totalDelMes(m.key))
  const primero = valores[0]
  const ultimo = valores[valores.length - 1]
  const global =
    primero === 0 ? 0 : ((ultimo - primero) / primero) * 100
  return {
    etiquetas,
    valores,
    variacionGlobal: `${global >= 0 ? "+" : ""}${global.toFixed(1).replace(".", ",")}%`,
  }
}

export function alquileresActivos() {
  return ALQUILERES_ACTIVOS.length
}

export function alquileresEnMora() {
  return ALQUILERES_ACTIVOS.filter((a) => a.mora).length
}

export function proximosAVencer() {
  return ALQUILERES_ACTIVOS.filter((a) => a.proximoVencer).length
}

/** Equipos listos para alquilar (stock disponible y operativos) */
export function equiposDisponibles() {
  const total = EQUIPOS.length
  const disponibles = EQUIPOS.filter(
    (e) => e.stock === "EN_STOCK" && e.operatividad === "OPERATIVO",
  ).length
  return { disponibles, total }
}

/** Ocupación promedio = equipos alquilados sobre el total del inventario */
export function ocupacionPromedio() {
  const total = EQUIPOS.length
  if (total === 0) return 0
  const alquilados = EQUIPOS.filter((e) => e.stock === "ALQUILADO").length
  return (alquilados / total) * 100
}

/** Top equipos por cantidad de operaciones históricas, con % relativo */
export function ocupacionPorEquipo(): OcupacionEquipo[] {
  const conteo = new Map<string, number>()
  for (const r of ALQUILERES_HISTORIAL) {
    for (const nombre of r.equipos) {
      conteo.set(nombre, (conteo.get(nombre) ?? 0) + 1)
    }
  }
  const top = [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const max = top[0]?.[1] ?? 1
  return top.map(([nombre, operaciones]) => ({
    nombre,
    operaciones,
    porcentaje: Math.round((operaciones / max) * 100),
  }))
}

export { formatARS }