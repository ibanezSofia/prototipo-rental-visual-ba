import Link from "next/link"
import { Brand } from "@/components/brand"

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-crema-oscuro">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Brand />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Alquiler de equipamiento audiovisual profesional en Buenos Aires.
            Cámaras, ópticas, sonido, iluminación y generadores.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/mis-alquileres" className="hover:text-foreground">
                Mis alquileres
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-foreground">
                Mostrador / Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Av. Corrientes 1234, CABA</li>
            <li>+54 11 5555-0100</li>
            <li>hola@rentalvisual.ba</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Rental Visual BA. Prototipo de catálogo y
          gestión de alquileres.
        </p>
      </div>
    </footer>
  )
}
