export const DASHBOARD_METRICS = [
  {
    id: "ingresos",
    titulo: "Ingresos del mes",
    valor: "$281.000",
    subtexto: "+12% vs. agosto",
  },
  {
    id: "alquileres",
    titulo: "Alquileres activos",
    valor: "23",
    subtexto: "3 vencen esta semana",
  },
  {
    id: "equipos",
    titulo: "Equipos disponibles",
    valor: "57",
    subtexto: "de 80 en inventario",
  },
  {
    id: "ocupacion",
    titulo: "Ocupación promedio",
    valor: "56%",
    subtexto: "+4 puntos este mes",
  },
] as const

export const MESES_ETIQUETAS = ["Abr", "May", "Jun", "Jul", "Ago", "Sep"]

/** Ingresos mensuales en miles de $ */
export const INGRESOS_MENSUALES = [180, 220, 200, 270, 310, 280] as const

export const VANACION_MENSUAL = "+51,9%"

export const EJES_Y = ["$0k", "$80k", "$160k", "$240k", "$320k"] as const

export const OCUPACION_EQUIPOS = [
  { nombre: "Pantalla LED 4×3m", porcentaje: 78 },
  { nombre: "Cámara Sony FX9", porcentaje: 65 },
  { nombre: "Sistema PA QSC", porcentaje: 71 },
  { nombre: "Consola Yamaha CL5", porcentaje: 58 },
  { nombre: "Proyector Epson", porcentaje: 52 },
] as const