"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlatform } from "@/lib/platform-context"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { session, currentCustomer, isAdmin, logout, hydrated } = usePlatform()

  const afterLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-primary">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Box className="size-4" />
          </span>
          Consign
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#lanes" className={pathname === "/" ? "text-foreground" : "hover:text-foreground"}>
            Network
          </Link>
          <Link href="/track" className={pathname.startsWith("/track") ? "text-foreground" : "hover:text-foreground"}>
            Tracking
          </Link>
          {hydrated && session?.kind === "customer" ? (
            <>
              <Link href="/dashboard" className={pathname.startsWith("/dashboard") ? "text-foreground" : "hover:text-foreground"}>
                Dashboard
              </Link>
              <Link href="/book" className={pathname.startsWith("/book") ? "text-foreground" : "hover:text-foreground"}>
                Book
              </Link>
            </>
          ) : null}
          {hydrated && isAdmin ? (
            <Link href="/operations" className={pathname.startsWith("/operations") ? "text-foreground" : "hover:text-foreground"}>
              Operations
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {!hydrated ? null : session?.kind === "customer" ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {currentCustomer?.name.split(" ")[0]}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={afterLogout}>
                Sign out
              </Button>
            </>
          ) : isAdmin ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">Ops</span>
              <Button variant="ghost" size="sm" onClick={afterLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Create account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
