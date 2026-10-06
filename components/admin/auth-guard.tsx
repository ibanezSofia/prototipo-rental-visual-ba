"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!getSession()) {
      router.replace("/admin/login")
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <span
          className={cn(
            "size-8 animate-spin rounded-full border-2 border-border",
            "border-t-verde",
          )}
        />
      </div>
    )
  }

  return children
}