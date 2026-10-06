import { PreReservasPanel } from "@/components/admin/pre-reservas-panel"

export const metadata = {
  title: "Pre-reservas · Mostrador",
}

export default function PreReservasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Pre-reservas
        </h1>
        <p className="text-sm text-muted-foreground">
          Autorizá o rechazá las solicitudes enviadas desde el portal del
          cliente. El sistema marca los conflictos de disponibilidad.
        </p>
      </header>
      <PreReservasPanel />
    </div>
  )
}
