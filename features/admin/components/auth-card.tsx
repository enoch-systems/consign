import type { ReactNode } from "react"
import { Shield, Truck } from "lucide-react"

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * Dedicated operations-console auth shell used by the admin auth pages
 * (forgot-password / update-password). Matches the admin login identity.
 */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-background text-foreground ops-auth-grid">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white shadow-md shadow-primary/30 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-serif text-xl font-semibold leading-none">Logix</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
              Operations Console
            </p>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xl shadow-foreground/[0.04]">
          <div className="mb-7 text-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-[0.1em] mb-4">
              <Shield className="w-3.5 h-3.5" />
              Admin / Operations
            </span>
            <h1 className="font-serif text-2xl sm:text-[28px] text-foreground tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          </div>
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
    </main>
  )
}