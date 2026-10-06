import { AlquileresPanel } from "@/components/admin/alquileres-panel"

export const metadata = {
  title: "Alquileres y mora · Mostrador",
}

export default function AlquileresPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Alquileres y mora
        </h1>
        <p className="text-sm text-muted-foreground">
          Registrá devoluciones (check-in) y controlá las entregas vencidas.
        </p>
      </header>
      <AlquileresPanel />
    </div>
  )
}
