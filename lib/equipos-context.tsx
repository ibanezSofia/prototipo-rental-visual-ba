"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { EQUIPOS, type Equipo } from "@/lib/data"

type EquiposContextValue = {
  equipos: Equipo[]
  getEquipo: (id: string) => Equipo | undefined
  actualizarPrecio: (id: string, precioDia: number) => void
}

const EquiposContext = createContext<EquiposContextValue | null>(null)

export function EquiposProvider({ children }: { children: ReactNode }) {
  const [equipos, setEquipos] = useState<Equipo[]>(EQUIPOS)

  const value = useMemo<EquiposContextValue>(
    () => ({
      equipos,
      getEquipo: (id) => equipos.find((e) => e.id === id),
      actualizarPrecio: (id, precioDia) =>
        setEquipos((prev) =>
          prev.map((e) => (e.id === id ? { ...e, precioDia } : e)),
        ),
    }),
    [equipos],
  )

  return (
    <EquiposContext.Provider value={value}>{children}</EquiposContext.Provider>
  )
}

export function useEquipos() {
  const ctx = useContext(EquiposContext)
  if (!ctx) {
    throw new Error("useEquipos debe usarse dentro de EquiposProvider")
  }
  return ctx
}
