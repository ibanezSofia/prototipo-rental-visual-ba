import { InventarioTabla } from "@/components/admin/inventario-tabla"

export const metadata = {
  title: "Inventario · Mostrador",
}

export default function InventarioPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Inventario
        </h1>
        <p className="text-sm text-muted-foreground">
          Cada equipo tiene dos estados independientes: dónde está
          (stock/ubicación) y su condición técnica (operatividad).
        </p>
      </header>
      <InventarioTabla />
    </div>
  )
}
