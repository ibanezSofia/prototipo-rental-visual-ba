"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Aperture, ArrowRight, Info, LockKeyhole, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loginUser, registerUser, getSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

const inputClasses =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"

export function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<"registrar" | "ingresar">("registrar")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getSession()) router.replace("/admin")
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!email.trim() || !password) {
      setError("Completá tu mail y tu contraseña.")
      return
    }

    setLoading(true)
    try {
      if (mode === "registrar") {
        if (password !== confirm) {
          setError("Las contraseñas no coinciden.")
          return
        }
        const res = await registerUser(email, password)
        if (!res.ok) {
          setError(res.error)
          return
        }
        setMessage("Usuario creado. Ingresando al mostrador…")
      } else {
        const res = await loginUser(email, password)
        if (!res.ok) {
          setError(res.error)
          return
        }
        setMessage("Sesión iniciada. Ingresando al mostrador…")
      }
      router.replace("/admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-marron text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #92d1cd 0, transparent 45%), radial-gradient(circle at 80% 0%, #d2a893 0, transparent 40%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <header className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-verde text-primary-foreground">
            <Aperture className="size-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
            Acceso administrativo
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Mostrador · Rental Visual BA
          </p>
        </header>

        <Card className="p-6 text-foreground sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted p-1">
            {(
              [
                { id: "registrar", label: "Crear usuario" },
                { id: "ingresar", label: "Ingresar" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setMode(t.id)
                  setError(null)
                  setMessage(null)
                }}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  mode === t.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className={cn(inputClasses, "pl-9")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Contraseña
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "registrar" ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputClasses, "pl-9")}
                />
              </div>
            </div>

            {mode === "registrar" && (
              <div>
                <label
                  htmlFor="confirm"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Repetí la contraseña
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={cn(inputClasses, "pl-9")}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-lg border border-verde/30 bg-verde/10 px-3 py-2 text-sm text-verde">
                {message}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? "Procesando…" : "Entrar"}
              {!loading && <ArrowRight />}
            </Button>
          </form>

          <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            {mode === "registrar"
              ? "Creá un usuario con tu mail y contraseña para acceder al mostrador."
              : "Usá el mail y la contraseña de tu usuario para ingresar."}
          </p>
        </Card>

        <p className="mt-6 text-center text-sm text-primary-foreground/70">
          <Link href="/" className="font-medium text-turquesa hover:underline">
            Volver al portal cliente
          </Link>
        </p>
      </div>
    </div>
  )
}