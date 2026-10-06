export type Categoria =
  | "Cámaras"
  | "Ópticas"
  | "Sonido"
  | "Iluminación"
  | "Generadores"

export const CATEGORIAS: Categoria[] = [
  "Cámaras",
  "Ópticas",
  "Sonido",
  "Iluminación",
  "Generadores",
]

/** Eje 1 — Ubicación / Stock */
export type EstadoStock =
  | "EN_STOCK"
  | "ALQUILADO"
  | "EN_SERVICIO_TECNICO"
  | "BAJA"

/** Eje 2 — Operatividad técnica */
export type EstadoOperativo =
  | "OPERATIVO"
  | "OPERATIVO_CON_OBSERVACIONES"
  | "EN_REPARACION"
  | "SIN_REVISAR"

export type Equipo = {
  id: string
  codigo: string
  nombre: string
  categoria: Categoria
  imagen: string
  precioDia: number
  descripcion: string
  especificaciones: { label: string; value: string }[]
  ubicacion: string
  stock: EstadoStock
  operatividad: EstadoOperativo
  /** Fecha probable de disponibilidad (si está alquilado) DD/MM */
  disponibleDesde?: string
}

export type EstadoAlquiler =
  | "PRE-RESERVA"
  | "CONFIRMADA"
  | "EN_CURSO"
  | "CERRADA"

export type Alquiler = {
  id: string
  cliente: string
  equipos: string[]
  estado: EstadoAlquiler
  fechaInicio: string
  fechaDevolucion: string
  total: number
  mora?: boolean
  diasAtraso?: number
}

const img = {
  camara: "/equipos/camara.png",
  optica: "/equipos/optica.png",
  sonido: "/equipos/sonido.png",
  iluminacion: "/equipos/iluminacion.png",
  generador: "/equipos/generador.png",
}

export const EQUIPOS: Equipo[] = [
  {
    id: "cam-001",
    codigo: "CAM-A-001",
    nombre: "Sony FX6 Full Frame",
    categoria: "Cámaras",
    imagen: img.camara,
    precioDia: 42000,
    descripcion:
      "Cámara de cine full frame para documental y publicidad. Cuerpo compacto, doble ranura CFexpress y autofoco de detección en tiempo real.",
    especificaciones: [
      { label: "Sensor", value: "Full Frame 10.2MP" },
      { label: "ISO", value: "Dual Base 800 / 12800" },
      { label: "Grabación", value: "4K 120fps" },
      { label: "Montura", value: "Sony E" },
    ],
    ubicacion: "Estante A1",
    stock: "EN_STOCK",
    operatividad: "OPERATIVO",
  },
  {
    id: "cam-002",
    codigo: "CAM-A-002",
    nombre: "Blackmagic URSA 12K",
    categoria: "Cámaras",
    imagen: img.camara,
    precioDia: 58000,
    descripcion:
      "Cámara de cine digital de alta resolución para producciones exigentes con flujo RAW.",
    especificaciones: [
      { label: "Sensor", value: "Super 35 12K" },
      { label: "Rango dinámico", value: "14 stops" },
      { label: "Grabación", value: "BRAW 12K 60fps" },
      { label: "Montura", value: "PL / EF" },
    ],
    ubicacion: "Estante A2",
    stock: "ALQUILADO",
    operatividad: "OPERATIVO",
    disponibleDesde: "28/09",
  },
  {
    id: "opt-001",
    codigo: "OPT-B-014",
    nombre: "Set Sigma Cine 24-35-50mm",
    categoria: "Ópticas",
    imagen: img.optica,
    precioDia: 31000,
    descripcion:
      "Juego de ópticas cine T1.5 con foco parfocal y engranajes estandarizados para follow focus.",
    especificaciones: [
      { label: "Apertura", value: "T1.5" },
      { label: "Cobertura", value: "Full Frame" },
      { label: "Montura", value: "PL" },
      { label: "Piezas", value: "3 lentes" },
    ],
    ubicacion: "Estante B4",
    stock: "EN_STOCK",
    operatividad: "OPERATIVO_CON_OBSERVACIONES",
  },
  {
    id: "opt-002",
    codigo: "OPT-B-021",
    nombre: "Canon CN-E 70-200mm",
    categoria: "Ópticas",
    imagen: img.optica,
    precioDia: 27000,
    descripcion:
      "Zoom telefoto cine ideal para cobertura de eventos y planos comprimidos.",
    especificaciones: [
      { label: "Apertura", value: "T4.4" },
      { label: "Cobertura", value: "Super 35" },
      { label: "Montura", value: "EF" },
      { label: "Peso", value: "1.25 kg" },
    ],
    ubicacion: "Estante B5",
    stock: "EN_SERVICIO_TECNICO",
    operatividad: "EN_REPARACION",
    disponibleDesde: "02/10",
  },
  {
    id: "son-001",
    codigo: "SON-C-009",
    nombre: "Zoom F8n Pro",
    categoria: "Sonido",
    imagen: img.sonido,
    precioDia: 18000,
    descripcion:
      "Grabador y mixer de campo de 8 canales con conversores de 32-bit float.",
    especificaciones: [
      { label: "Canales", value: "8 in / 10 track" },
      { label: "Resolución", value: "32-bit float" },
      { label: "Alimentación", value: "AA / L-mount" },
      { label: "Timecode", value: "Sí" },
    ],
    ubicacion: "Estante C2",
    stock: "EN_STOCK",
    operatividad: "OPERATIVO",
  },
  {
    id: "son-002",
    codigo: "SON-C-012",
    nombre: "Sennheiser MKH 416",
    categoria: "Sonido",
    imagen: img.sonido,
    precioDia: 9500,
    descripcion:
      "Micrófono shotgun de referencia para exteriores, direccional y de bajo ruido.",
    especificaciones: [
      { label: "Patrón", value: "Supercardioide" },
      { label: "Respuesta", value: "40Hz - 20kHz" },
      { label: "Alimentación", value: "Phantom 48V" },
      { label: "Conector", value: "XLR-3" },
    ],
    ubicacion: "Estante C3",
    stock: "ALQUILADO",
    operatividad: "OPERATIVO",
    disponibleDesde: "26/09",
  },
  {
    id: "ilu-001",
    codigo: "ILU-D-005",
    nombre: "Aputure 600D Pro",
    categoria: "Iluminación",
    imagen: img.iluminacion,
    precioDia: 22000,
    descripcion:
      "Luz LED daylight de alta potencia con control por app y montura Bowens.",
    especificaciones: [
      { label: "Potencia", value: "600W" },
      { label: "Temperatura", value: "5600K" },
      { label: "CRI", value: "96+" },
      { label: "Montura", value: "Bowens" },
    ],
    ubicacion: "Estante D1",
    stock: "EN_STOCK",
    operatividad: "OPERATIVO",
  },
  {
    id: "ilu-002",
    codigo: "ILU-D-008",
    nombre: "Astera Titan Tube (x4)",
    categoria: "Iluminación",
    imagen: img.iluminacion,
    precioDia: 26000,
    descripcion:
      "Set de tubos LED RGB inalámbricos con batería interna y control CRMX.",
    especificaciones: [
      { label: "Piezas", value: "4 tubos" },
      { label: "Color", value: "RGB + Mint + Amber" },
      { label: "Batería", value: "Hasta 20 h" },
      { label: "Control", value: "CRMX / App" },
    ],
    ubicacion: "Estante D3",
    stock: "EN_STOCK",
    operatividad: "SIN_REVISAR",
  },
  {
    id: "gen-001",
    codigo: "GEN-E-002",
    nombre: "Honda EU22i Inverter",
    categoria: "Generadores",
    imagen: img.generador,
    precioDia: 15000,
    descripcion:
      "Generador inverter silencioso, ideal para rodajes en locación con energía estable.",
    especificaciones: [
      { label: "Potencia", value: "2200W" },
      { label: "Autonomía", value: "8 h al 25%" },
      { label: "Ruido", value: "48-57 dB" },
      { label: "Peso", value: "21 kg" },
    ],
    ubicacion: "Taller técnico",
    stock: "EN_SERVICIO_TECNICO",
    operatividad: "EN_REPARACION",
    disponibleDesde: "30/09",
  },
  {
    id: "gen-002",
    codigo: "GEN-E-004",
    nombre: "Generador Diesel 6kVA",
    categoria: "Generadores",
    imagen: img.generador,
    precioDia: 34000,
    descripcion:
      "Generador diésel de alta capacidad para producciones grandes y consumo sostenido.",
    especificaciones: [
      { label: "Potencia", value: "6 kVA" },
      { label: "Combustible", value: "Diésel" },
      { label: "Autonomía", value: "12 h" },
      { label: "Salidas", value: "220V / 380V" },
    ],
    ubicacion: "Estante E1",
    stock: "BAJA",
    operatividad: "EN_REPARACION",
  },
]

export const ALQUILERES_CLIENTE: Alquiler[] = [
  {
    id: "RV-2041",
    cliente: "Vos",
    equipos: ["Sony FX6 Full Frame", "Set Sigma Cine 24-35-50mm"],
    estado: "EN_CURSO",
    fechaInicio: "20/09",
    fechaDevolucion: "25/09",
    total: 365000,
  },
  {
    id: "RV-2055",
    cliente: "Vos",
    equipos: ["Aputure 600D Pro", "Astera Titan Tube (x4)"],
    estado: "CONFIRMADA",
    fechaInicio: "01/10",
    fechaDevolucion: "04/10",
    total: 144000,
  },
  {
    id: "RV-2061",
    cliente: "Vos",
    equipos: ["Zoom F8n Pro", "Sennheiser MKH 416"],
    estado: "PRE-RESERVA",
    fechaInicio: "10/10",
    fechaDevolucion: "12/10",
    total: 55000,
  },
  {
    id: "RV-1998",
    cliente: "Vos",
    equipos: ["Blackmagic URSA 12K"],
    estado: "CERRADA",
    fechaInicio: "01/09",
    fechaDevolucion: "05/09",
    total: 290000,
  },
]

export const PRE_RESERVAS = [
  {
    id: "PR-3012",
    cliente: "Productora Sur Cine",
    contacto: "malena@surcine.com",
    equipos: ["Sony FX6 Full Frame", "Set Sigma Cine 24-35-50mm"],
    fechaInicio: "29/09",
    fechaDevolucion: "03/10",
    total: 365000,
    disponibilidad: "OK" as "OK" | "CONFLICTO",
  },
  {
    id: "PR-3018",
    cliente: "Nicolás Ferreyra (Realizador)",
    contacto: "nico.f@gmail.com",
    equipos: ["Blackmagic URSA 12K"],
    fechaInicio: "27/09",
    fechaDevolucion: "29/09",
    total: 174000,
    disponibilidad: "CONFLICTO" as "OK" | "CONFLICTO",
  },
  {
    id: "PR-3021",
    cliente: "Estudio Rivera",
    contacto: "hola@estudiorivera.ar",
    equipos: ["Aputure 600D Pro", "Astera Titan Tube (x4)"],
    fechaInicio: "05/10",
    fechaDevolucion: "08/10",
    total: 144000,
    disponibilidad: "OK" as "OK" | "CONFLICTO",
  },
]

export const ALQUILERES_ACTIVOS: Alquiler[] = [
  {
    id: "RV-2041",
    cliente: "Productora Norte",
    equipos: ["Blackmagic URSA 12K"],
    estado: "EN_CURSO",
    fechaInicio: "22/09",
    fechaDevolucion: "22/09",
    total: 174000,
  },
  {
    id: "RV-2033",
    cliente: "Sonidista M. Paz",
    equipos: ["Sennheiser MKH 416"],
    estado: "EN_CURSO",
    fechaInicio: "18/09",
    fechaDevolucion: "21/09",
    total: 38000,
    mora: true,
    diasAtraso: 1,
  },
  {
    id: "RV-2029",
    cliente: "Colectivo Audiovisual La Boca",
    equipos: ["Aputure 600D Pro"],
    estado: "EN_CURSO",
    fechaInicio: "15/09",
    fechaDevolucion: "20/09",
    total: 110000,
    mora: true,
    diasAtraso: 2,
  },
]

export function formatARS(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n)
}

export function getEquipo(id: string) {
  return EQUIPOS.find((e) => e.id === id)
}
