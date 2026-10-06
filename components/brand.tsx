import { Aperture } from "lucide-react"
import { cn } from "@/lib/utils"

export function Brand({
  className,
  variant = "dark",
}: {
  className?: string
  variant?: "dark" | "light"
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-verde text-primary-foreground">
        <Aperture className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-base font-bold tracking-tight",
            variant === "light" ? "text-primary-foreground" : "text-foreground",
          )}
        >
          Rental Visual BA
        </span>
        <span
          className={cn(
            "text-[11px] font-medium",
            variant === "light" ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Equipamiento audiovisual
        </span>
      </span>
    </span>
  )
}
