"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, formatCurrency, formatDate, formatDateTime } from "@/components/shared/status-badge";
import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import { Package, Truck, CheckCircle2, Clock, AlertTriangle, Plus, Search, FolderKanban, Bell, UserCircle, ArrowRight, Hash, MapPin, TrendingUp, Activity } from "lucide-react";

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
    <div className="customer-dashboard container mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-950/10 sm:px-10 sm:py-9">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/35 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_minmax(300px,420px)] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Account overview
            </div>
            <p className="text-sm text-white/60">Welcome back,</p>
            <h1 className="mt-1 font-serif text-3xl tracking-tight sm:text-5xl">{name}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">Your shipments, updates, and delivery details are all in one place.</p>
          </div>
          <form onSubmit={trackSubmit}>
            <label htmlFor="quick-track" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/55">Track a shipment</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-sm">
              <Search className="ml-3 h-4 w-4 shrink-0 text-white/55" />
              <input id="quick-track" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter tracking number" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-white/45" />
              <Button type="submit" size="sm" className="rounded-xl bg-white text-slate-950 hover:bg-white/90">Track</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-5 sm:gap-4 sm:py-8">
        <KpiCard icon={<Package className="w-5 h-5" />} label="Total Shipments" value={String(stats.total)} tone="bg-primary/10 text-primary" />
        <KpiCard icon={<Truck className="w-5 h-5" />} label="Active" value={String(stats.active)} tone="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" />
        <KpiCard icon={<CheckCircle2 className="w-5 h-5" />} label="Delivered" value={String(stats.delivered)} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" />
        <KpiCard icon={<Clock className="w-5 h-5" />} label="Pending" value={String(stats.pending)} tone="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" />
        <KpiCard icon={<AlertTriangle className="w-5 h-5" />} label="Exceptions" value={String(stats.exception)} tone="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <QuickCard href="/customer/shipments/new" icon={<Plus className="w-5 h-5" />} title="Create Shipment" desc="Book a new pickup" grad="from-primary to-cyan-500" />
        <QuickCard href="#" onClick={(e) => { e.preventDefault(); router.push(`/track/${q.trim() || "LGX8429137"}`); }} icon={<Search className="w-5 h-5" />} title="Track Shipment" desc="Check status live" grad="from-violet-500 to-indigo-600" />
        <QuickCard href="/customer/shipments" icon={<FolderKanban className="w-5 h-5" />} title="View Shipments" desc="See all shipments" grad="from-amber-500 to-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/70 bg-card/85 shadow-sm backdrop-blur-sm lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg flex items-center gap-2"><Activity className="w-4 h-4 text-primary" />Recent Shipments</CardTitle>
            <Button asChild variant="outline" size="sm" className="rounded-full"><Link href="/customer/shipments">View all <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link></Button>
          </CardHeader>
          <CardContent>
            {!recentShipments.length ? (
              <EmptyState icon={<Package className="w-8 h-8" />} title="No shipments yet" subtitle="Create your first shipment to begin." />
            ) : (
              <div className="space-y-3">
                {recentShipments.map((s) => (
                  <Link key={s.id} href={`/customer/shipments/${s.id}`} className="group flex items-center gap-3 sm:gap-4 rounded-2xl border bg-background/60 hover:bg-muted/30 transition p-3 sm:p-4">
                    <div className="w-11 h-11 rounded-2xl rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-primary">{s.trackingNumber}</span>
                        <StatusBadge status={s.status} className="scale-90 origin-left" />
                      </div>
                      <div className="text-sm truncate text-muted-foreground">
                        <span className="text-foreground/90">{s.origin}</span> → <span className="text-foreground/90">{s.destination}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</p>
                      <p className="text-xs text-foreground font-medium">{formatCurrency(s.cost, s.currency)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/85 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg flex items-center gap-2"><Bell className="w-4 h-4 text-primary" />Notifications <span className="text-xs font-sans font-semibold text-muted-foreground normal-case tracking-normal">({unreadCount(session?.userId || "")} unread)</span></CardTitle>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-xs"><Link href="/customer/notifications">All</Link></Button>
          </CardHeader>
          <CardContent>
            {!notifs.length ? (
              <EmptyState icon={<Bell className="w-8 h-8" />} title="No notifications" subtitle="We&apos;ll alert you when your shipments are updated." />
            ) : (
              <ul className="space-y-2">
                {notifs.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full text-left rounded-xl p-3 border border-transparent transition ${n.read ? "bg-transparent hover:bg-muted/30" : "bg-primary/5 border-primary/10 hover:bg-primary/10"}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{formatDateTime(n.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {recentShipments[0] && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="border-border/70 bg-card/85 shadow-sm backdrop-blur-sm lg:col-span-3">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Latest Tracking Activity
                <span className="font-sans text-xs font-semibold text-primary/80 normal-case tracking-normal ml-2 font-mono">{recentShipments[0].trackingNumber}</span>
              </CardTitle>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href={`/track/${recentShipments[0].trackingNumber}`}>Open tracking <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <TrackingTimeline events={recentShipments[0].trackingEvents.slice(0, 5)} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/85 shadow-sm backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2"><UserCircle className="w-4 h-4 text-primary" /> Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCustomer && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-serif text-xl flex items-center justify-center">{currentCustomer.fullName[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{currentCustomer.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentCustomer.email}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full"><Link href="/customer/profile">Edit</Link></Button>
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
      )}
    </div>
  );
}

import React from "react";

function KpiCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <Card className="boty-shadow border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex w-9 h-9 rounded-xl items-center justify-center ${tone}`}>{icon}</span>
          <span className="text-2xl font-serif font-semibold">{value}</span>
        </div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function QuickCard({ href, icon, title, desc, grad, onClick }: { href: string; icon: React.ReactNode; title: string; desc: string; grad: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Link href={href} onClick={onClick}>
      <Card className="boty-shadow border overflow-hidden group hover:-translate-y-0.5 transition">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-br ${grad} p-5 text-white relative overflow-hidden`}>
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">{icon}</div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition" />
            </div>
            <div className="relative mt-6">
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="text-sm text-white/80">{desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-dashed py-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">{icon}</div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function SmallInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/20 dark:bg-muted/20 p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  );
}
