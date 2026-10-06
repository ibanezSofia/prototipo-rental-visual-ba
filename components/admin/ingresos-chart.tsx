import { Badge } from "@/components/ui/badge"
import {
  EJES_Y,
  INGRESOS_MENSUALES,
  MESES_ETIQUETAS,
  VANACION_MENSUAL,
} from "@/lib/dashboard"

const W = 640
const H = 260
const PAD_X = 38
const PAD_TOP = 18
const PAD_BOTTOM = 34

function buildPath(values: number[]) {
  const max = 320
  const innerW = W - PAD_X
  const innerH = H - PAD_TOP - PAD_BOTTOM
  const x = (i: number) => PAD_X + (i / (values.length - 1)) * innerW
  const y = (v: number) =>
    PAD_TOP + innerH - (Math.min(v, max) / max) * innerH

  const points = values.map((v, i) => ({ x: x(i), y: y(v) }))
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    const cx = (prev.x + cur.x) / 2
    d += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`
  }
  return { d, points }
}

export function IngresosChart() {
  const { d, points } = buildPath([...INGRESOS_MENSUALES])
  const max = 320
  const innerW = W - PAD_X
  const innerH = H - PAD_TOP - PAD_BOTTOM

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Gráfico de ingresos mensuales"
    >
      {EJES_Y.map((label, i) => {
        const y = PAD_TOP + (i / (EJES_Y.length - 1)) * innerH
        return (
          <g key={label}>
            <line
              x1={PAD_X}
              x2={W - 4}
              y1={y}
              y2={y}
              className="stroke-border"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <text
              x={PAD_X - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[11px]"
            >
              {label}
            </text>
          </g>
        )
      })}

      {MESES_ETIQUETAS.map((m, i) => (
        <text
          key={m}
          x={PAD_X + (i / (MESES_ETIQUETAS.length - 1)) * innerW}
          y={H - 10}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          {m}
        </text>
      ))}

      <path
        d={`${d} L ${points[points.length - 1].x} ${PAD_TOP + innerH} L ${points[0].x} ${PAD_TOP + innerH} Z`}
        className="fill-verde/10"
      />
      <path d={d} className="fill-none stroke-verde" strokeWidth={2.5} />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} className="fill-verde" />
          <circle
            cx={p.x}
            cy={p.y}
            r={4}
            className="fill-none stroke-card"
            strokeWidth={2}
          />
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-semibold"
          >
            ${INGRESOS_MENSUALES[i]}k
          </text>
        </g>
      ))}
    </svg>
  )
}

export function IngresosCard() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">
            Ingresos mensuales
          </h2>
          <p className="text-xs text-muted-foreground">
            Evolución de los últimos 6 meses
          </p>
        </div>
        <Badge tone="verde">{VANACION_MENSUAL}</Badge>
      </div>
      <div className="mt-4">
        <IngresosChart />
      </div>
    </section>
  )
}