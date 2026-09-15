import { cn } from "@/lib/utils"
import { statusTone } from "@/lib/status"
import type { ShipmentStatus } from "@/lib/types"

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const tone = statusTone(status)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone.className,
      )}
    >
      {tone.label}
    </span>
  )
}
