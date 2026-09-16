"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BrandLogo } from "@/components/shared/brand-logo";
import {
  Shield, UserRound, Lock, ArrowRight, Loader2, Eye, EyeOff, Truck,
  Package, Globe2, Clock, AlertCircle, ChevronLeft, Activity,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAppState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const clearError = () => {
    if (error) setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const fe: { username?: string; password?: string } = {};
    if (!username.trim()) fe.username = "Enter your username.";
    if (!password) fe.password = "Enter your password.";
    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) return;
    setLoading(true);
    try {
      const result = adminLogin(username.trim(), password);
      if (result.success) {
        toast.success("Welcome, Administrator.", {
          description: "Operational control center is now available.",
        });
        router.replace("/admin");
      } else {
        setError(result.error || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground ops-auth-grid">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 px-4 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition rounded-full px-3 py-1.5 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to site</span>
        </Link>
        <ThemeToggle size="sm" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-14 sm:py-20">
        <div className="w-full max-w-[1080px] grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Left — Operations identity (desktop) */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-12 w-12 rounded-2xl object-contain" />
              <div>
                <p className="font-serif text-2xl font-semibold tracking-wide leading-none">ArcBest</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-[0.2em]">Operations Console</p>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-[0.1em] mb-4">
                <Shield className="w-3.5 h-3.5" />
                Admin / Operations
              </span>
              <h1 className="font-serif text-4xl xl:text-[44px] leading-[1.1] tracking-tight mb-4">
                Run your network with clarity.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Shipment control, live visibility and customer operations — in one dedicated workspace for your team.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 max-w-md">
              <HeroStat icon={<Activity className="w-4 h-4" />} k="8" v="Status stages" />
              <HeroStat icon={<Package className="w-4 h-4" />} k="4" v="Shipping methods" />
              <HeroStat icon={<Globe2 className="w-4 h-4" />} k="50+" v="Countries covered" />
              <HeroStat icon={<Clock className="w-4 h-4" />} k="24/7" v="Live monitoring" />
            </div>

            <div className="relative rounded-3xl overflow-hidden border bg-gradient-to-br from-slate-900 via-[#0B1A3A] to-slate-900 text-white p-6 max-w-md">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl" />
              <div className="relative">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/50 mb-3">Live Snapshot</p>
                <div className="flex items-baseline justify-between mb-5">
                  <p className="font-serif text-4xl font-semibold">142</p>
                  <p className="text-sm text-emerald-300 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Now
                  </p>
                </div>
                <div className="space-y-2.5">
                  <MiniRow label="In Transit" value="68" bar="68%" tone="bg-violet-400" />
                  <MiniRow label="Out for Delivery" value="31" bar="31%" tone="bg-amber-400" />
                  <MiniRow label="Exceptions" value="4" bar="4%" tone="bg-rose-400" />
                </div>
              </div>
            </div>
          </div>
          {/* Right — Auth card */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile-only brand */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-7">
              <BrandLogo className="h-10 w-10 rounded-xl object-contain" />
              <div>
                <p className="font-serif text-xl font-semibold leading-none">ArcBest</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Ops Console</p>
              </div>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card shadow-xl shadow-foreground/[0.04] overflow-hidden">
              <div className="px-6 sm:px-8 pt-8 pb-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-[0.1em] mb-4">
                  <Shield className="w-3.5 h-3.5" />
                  Admin / Operations
                </div>
                <h2 className="font-serif text-[26px] sm:text-3xl tracking-tight leading-tight">
                  Sign in to control center
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Restricted area. Authorized operators only.
                </p>
              </div>

              <form onSubmit={submit} className="px-6 sm:px-8 pt-5 pb-4 space-y-5" noValidate>
                {/* Username */}
                <div className="space-y-2">
                  <label htmlFor="admin-username" className="text-sm font-medium text-foreground">
                    Username
                  </label>
                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground pointer-events-none" />
                    <input
                      id="admin-username"
                      name="username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); clearError(); setFieldErrors((f) => ({ ...f, username: undefined })); }}
                      placeholder="Operations username"
                      aria-invalid={!!fieldErrors.username}
                      className={`w-full h-12 pl-10 pr-4 rounded-xl border bg-background text-sm placeholder:text-muted-foreground/70 transition focus:outline-none focus:ring-2 ${
                        fieldErrors.username
                          ? "border-destructive/60 focus:ring-destructive/25"
                          : "border-border focus:ring-ring/30 focus:border-ring/50"
                      }`}
                    />
                  </div>
                  {fieldErrors.username && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground pointer-events-none" />
                    <input
                      id="admin-password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError(); setFieldErrors((f) => ({ ...f, password: undefined })); }}
                      placeholder="Enter your password"
                      aria-invalid={!!fieldErrors.password}
                      className={`w-full h-12 pl-10 pr-12 rounded-xl border bg-background text-sm placeholder:text-muted-foreground/70 transition focus:outline-none focus:ring-2 ${
                        fieldErrors.password
                          ? "border-destructive/60 focus:ring-destructive/25"
                          : "border-border focus:ring-ring/30 focus:border-ring/50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/25 bg-destructive/10 text-destructive text-sm p-3.5 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-[18px] h-[18px] shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={(v) => setRemember(Boolean(v))}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span htmlFor="remember" className="text-sm text-muted-foreground group-hover:text-foreground transition">
                      Remember this device
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info("Contact your system administrator.", { description: "Password reset is managed by IT." })}
                    className="text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/92 transition active:scale-[0.99] disabled:opacity-60 disabled:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring px-5"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-[18px] h-[18px] animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Enter Control Center
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-3 mt-1 border-t border-border/60">
                  <p className="text-[11px] leading-relaxed text-muted-foreground flex items-start gap-2">
                    <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
                    <span>
                      All sessions are logged and encrypted. Unauthorized access attempts are monitored and reported.
                    </span>
                  </p>
                </div>
              </form>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              © {new Date().getFullYear()} ArcBest Logistics · Operations Console · v2.1
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
function HeroStat({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-[11px] uppercase tracking-[0.12em] mb-2">
        <span className="text-primary">{icon}</span>
        <span>{v}</span>
      </div>
      <p className="font-serif text-2xl font-semibold leading-none tracking-tight">{k}</p>
    </div>
  );
}

function MiniRow({ label, value, bar, tone }: { label: string; value: string; bar: string; tone: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-mono font-medium">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: bar }} />
      </div>
    </div>
  );
}
