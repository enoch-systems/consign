"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePlatform } from "@/lib/platform-context"

export function RequireSession({
  kind,
  children,
}: {
  kind: "customer" | "admin"
  children: React.ReactNode
}) {
  const router = useRouter()
  const { hydrated, session } = usePlatform()

  useEffect(() => {
    if (!hydrated) return
    if (session?.kind !== kind) {
      router.replace(kind === "admin" ? "/login?role=admin" : "/login")
    }
  }, [hydrated, kind, router, session])

  if (!hydrated || session?.kind !== kind) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">
        Checking your session…
      </div>
    )
  }

  return <>{children}</>
}
