"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, formatCurrency, formatDate, formatDateTime } from "@/components/shared/status-badge";
import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  FolderKanban,
  Bell,
  UserCircle,
  ArrowRight,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { session, currentCustomer, shipmentsByCustomer, unreadCount, notificationsByCustomer, shipmentStatsByCustomer, markNotificationRead } = useAppState();
  const stats = shipmentStatsByCustomer(session?.userId || "");
  const shipments = shipmentsByCustomer(session?.userId || "");
  const recentShipments = [...shipments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const notifs = notificationsByCustomer(session?.userId || "").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const name = currentCustomer?.fullName?.split(" ")[0] || "Customer";
  const [q, setQ] = React.useState("");

  const trackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/track/${q.trim().toUpperCase()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
      <div className="relative overflow-hidden rounded-[30px] border border-slate-800/70 bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.25),transparent_35%),linear-gradient(135deg,#0f172a_0%,#111827_38%,#0f172a_100%)] px-5 py-6 text-white shadow-[0_35px_80px_-40px_rgba(15,23,42,0.9)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/30 via-primary/10 to-transparent" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Account overview
            </div>
            <p className="text-sm text-white/70">Welcome back,</p>
            <h1 className="mt-1 font-serif text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">{name}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Your shipments, updates, and delivery details are all in one place.
            </p>
          </div>

          <form onSubmit={trackSubmit} className="w-full">
            <label htmlFor="quick-track" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
              Track a shipment
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-sm">
              <Search className="ml-3 h-4 w-4 shrink-0 text-white/60" />
              <input
                id="quick-track"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Enter tracking number"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-white/45"
              />
              <Button type="submit" size="sm" className="rounded-xl bg-white text-slate-950 hover:bg-white/90">
                Track
              </Button>
            </div>
          </form>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-5 sm:gap-4 sm:py-8">
        <KpiCard icon={<Package className="w-5 h-5" />} label="Total Shipments" value={String(stats.total)} tone="bg-primary/10 text-primary" />
        <KpiCard icon={<Truck className="w-5 h-5" />} label="Active" value={String(stats.active)} tone="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" />
        <KpiCard icon={<CheckCircle2 className="w-5 h-5" />} label="Delivered" value={String(stats.delivered)} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" />
        <KpiCard icon={<Clock className="w-5 h-5" />} label="Pending" value={String(stats.pending)} tone="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" />
        <KpiCard icon={<AlertTriangle className="w-5 h-5" />} label="Exceptions" value={String(stats.exception)} tone="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" />
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <QuickCard href="/customer/shipments/new" icon={<Plus className="w-5 h-5" />} title="Create Shipment" desc="Book a new pickup" grad="from-primary to-cyan-500" />
        <QuickCard
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push(`/track/${q.trim() || "LGX8429137"}`);
          }}
          icon={<Search className="w-5 h-5" />}
          title="Track Shipment"
          desc="Check status live"
          grad="from-violet-500 to-indigo-600"
        />
        <QuickCard href="/customer/shipments" icon={<FolderKanban className="w-5 h-5" />} title="View Shipments" desc="See all shipments" grad="from-amber-500 to-rose-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <Card className="border-border/70 bg-card/85 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between gap-3 pb-4">
              <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Activity className="w-4 h-4" />
                </span>
                Recent Shipments
              </CardTitle>
              <Button asChild variant="outline" size="sm" className="rounded-full h-9 px-3">
                <Link href="/customer/shipments">
                  View all <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!recentShipments.length ? (
                <EmptyState icon={<Package className="w-8 h-8" />} title="No shipments yet" subtitle="Create your first shipment to begin." />
              ) : (
                <div className="space-y-3">
                  {recentShipments.map((s) => (
                    <Link key={s.id} href={`/customer/shipments/${s.id}`} className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 p-3 transition hover:bg-muted/30 sm:gap-4 sm:p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold tracking-wide text-primary">{s.trackingNumber}</span>
                          <StatusBadge status={s.status} className="scale-90 origin-left" />
                        </div>
                        <div className="truncate text-sm text-muted-foreground">
                          <span className="text-foreground/90">{s.origin}</span> → <span className="text-foreground/90">{s.destination}</span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 text-right sm:block">
                        <p className="text-[11px] text-muted-foreground">{formatDate(s.createdAt)}</p>
                        <p className="text-xs font-medium text-foreground">{formatCurrency(s.cost, s.currency)}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {recentShipments[0] && (
            <Card className="border-border/70 bg-card/85 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur-sm">
              <CardHeader className="flex-row items-center justify-between gap-3 pb-4">
                <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  Latest Tracking Activity
                </CardTitle>
                <Button asChild variant="outline" size="sm" className="rounded-full h-9 px-3">
                  <Link href={`/track/${recentShipments[0].trackingNumber}`}>
                    Open tracking <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <TrackingTimeline events={recentShipments[0].trackingEvents.slice(0, 5)} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card/85 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between gap-3 pb-4">
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bell className="w-4 h-4" />
                </span>
                Notifications
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="rounded-full px-2 text-xs">
                <Link href="/customer/notifications">All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!notifs.length ? (
                <EmptyState icon={<Bell className="w-8 h-8" />} title="No notifications" subtitle="We&apos;ll alert you when your shipments are updated." />
              ) : (
                <ul className="space-y-3">
                  {notifs.map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${n.read ? "border-transparent bg-transparent hover:bg-muted/30" : "border-primary/10 bg-primary/5 hover:bg-primary/10"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                            <p className="mt-2 text-[11px] text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/85 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCircle className="w-4 h-4" />
                </span>
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCustomer && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                      {currentCustomer.fullName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-foreground">{currentCustomer.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">{currentCustomer.email}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full h-9 px-3">
                      <Link href="/customer/profile">Edit</Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SmallInfo label="Country" value={currentCustomer.country} />
                    <SmallInfo label="City" value={currentCustomer.city} />
                    <SmallInfo label="Phone" value={currentCustomer.phone} />
                    <SmallInfo label="Status" value={currentCustomer.accountStatus} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

import React from "react";

function KpiCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <Card className="border border-border/60 bg-card/85 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.45)]">
      <CardContent className="pt-5">
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
          <span className="text-2xl font-serif font-semibold text-foreground">{value}</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function QuickCard({ href, icon, title, desc, grad, onClick }: { href: string; icon: React.ReactNode; title: string; desc: string; grad: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Link href={href} onClick={onClick}>
      <Card className="group overflow-hidden border border-transparent shadow-[0_18px_35px_-30px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:border-white/10">
        <CardContent className="p-0">
          <div className={`relative overflow-hidden bg-gradient-to-br ${grad} p-5 text-white`}>
            <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">{icon}</div>
              <ArrowRight className="h-5 w-5 opacity-80 transition group-hover:translate-x-1" />
            </div>
            <div className="relative mt-6">
              <h3 className="font-serif text-xl text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/80">{desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 py-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">{icon}</div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function SmallInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
