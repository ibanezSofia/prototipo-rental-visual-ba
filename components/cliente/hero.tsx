import Link from "next/link"
import { ArrowRight, Camera, Aperture, Mic, Lightbulb, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const categorias = [
  { icon: Camera, label: "Cámaras" },
  { icon: Aperture, label: "Ópticas" },
  { icon: Mic, label: "Sonido" },
  { icon: Lightbulb, label: "Iluminación" },
  { icon: Zap, label: "Generadores" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-marron text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #92d1cd 0, transparent 45%), radial-gradient(circle at 80% 0%, #d2a893 0, transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-turquesa">
          Buenos Aires · Alquiler profesional
        </span>
        <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
          Equipamiento audiovisual listo para tu próxima producción
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-primary-foreground/75">
          Reservá cámaras, ópticas, sonido, iluminación y generadores con
          disponibilidad y estado técnico transparente. Gestión de reservas,
          entregas y devoluciones en un solo lugar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="#catalogo" />}
            className="bg-turquesa text-[#26403e] hover:bg-turquesa/85"
          >
            Ver catálogo
            <ArrowRight />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/mis-alquileres" />}
            className="border-white/20 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          >
            Mis alquileres
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {categorias.map((c) => (
            <Link
              key={c.label}
              href="#catalogo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-primary-foreground/85 transition-colors hover:border-turquesa/40 hover:text-primary-foreground"
            >
              <c.icon className="size-4 text-turquesa" />
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
