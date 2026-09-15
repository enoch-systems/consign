"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAppState } from "@/lib/app-state";
import { StatusBadge, formatCurrency, formatDate, formatDateTime } from "@/components/shared/status-badge";
import type { ShipmentStatus } from "@/lib/types";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  Users, Package, Truck, AlertTriangle, CheckCircle2, Send, DollarSign,
  Activity, ArrowRight, MapPin, Box, Clock, ChevronRight, TrendingUp,
  ShieldCheck, Shield, Edit3,
} from "lucide-react";
import { AdminPageHeader } from "@/components/shared/admin/admin-page-header";
import { AdminShipmentCard } from "@/components/shared/admin/admin-shipment-card";

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  "Order Created": "#3b82f6",
  "Confirmed": "#6366f1",
  "Picked Up": "#0ea5e9",
  "In Transit": "#8b5cf6",
  "Arrived at Facility": "#06b6d4",
  "Out for Delivery": "#f59e0b",
  "Delivered": "#10b981",
  "Exception": "#ef4444",
};

const ACTIVITY_ICON: Record<string, React.ReactNode> = {
  admin_logged_in: <Shield className="w-4.5 h-4.5" />,
  customer_registered: <Users className="w-4.5 h-4.5" />,
  shipment_created: <Package className="w-4.5 h-4.5" />,
  shipment_status_changed: <Truck className="w-4.5 h-4.5" />,
  tracking_event_added: <Edit3 className="w-4.5 h-4.5" />,
  shipment_delivered: <CheckCircle2 className="w-4.5 h-4.5" />,
  customer_updated: <Users className="w-4.5 h-4.5" />,
};

const ACTIVITY_TONE: Record<string, string> = {
  admin_logged_in: "border-indigo-500/25 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  customer_registered: "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  shipment_created: "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shipment_status_changed: "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  tracking_event_added: "border-cyan-500/25 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  shipment_delivered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  customer_updated: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminStats, shipments, customers, recentActivity } = useAppState();
  const s = adminStats();
  const recentShipments = useMemo(
    () => [...shipments].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).slice(0, 5),
    [shipments]
  );
  const newUsers = useMemo(
    () => [...customers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4),
    [customers]
  );
  const activity = recentActivity(8);

  const statusDistribution = useMemo(() => {
    const order: ShipmentStatus[] = [
      "Order Created", "Confirmed", "Picked Up", "In Transit",
      "Arrived at Facility", "Out for Delivery", "Delivered", "Exception",
    ];
    return order.map((st) => ({
      name: st,
      value: shipments.filter((x) => x.status === st).length,
      color: STATUS_COLORS[st],
    })).filter((x) => x.value > 0);
  }, [shipments]);

  return (
    <div className="max-w-[1400px] mx-auto pb-10 sm:pb-14 flex flex-col">
      {/* Header */}
      <AdminPageHeader
        eyebrow={new Date().toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })}
        title="Operations Dashboard"
        actions={
          <>
            <Link
              href="/admin/shipments"
              className="inline-flex items-center justify-center gap-1.5 h-11 px-4 flex-1 sm:flex-none rounded-xl border border-border bg-card hover:bg-accent/10 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">View Shipments</span>
              <span className="sm:hidden">All Shipments</span>
            </Link>
            <Link
              href="/customer/shipments/new"
              className="inline-flex items-center justify-center gap-1.5 h-11 px-4 sm:px-5 flex-1 sm:flex-none rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/92 shadow-lg shadow-primary/20 transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Box className="w-4 h-4" />
              <span>New Shipment</span>
            </Link>
          </>
        }
      />

      {/* Tier 1 KPIs — highest priority: Active, OFD, Exceptions, Delivered */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 mb-2.5 sm:mb-4 lg:grid-cols-4">
        <CriticalCard
          label="Active Shipments"
          value={String(s.active)}
          sub={`${s.inTransit} in transit`}
          tone="bg-blue-500 text-white dark:bg-blue-600"
          icon={<Truck className="w-5 h-5" />}
          href="/admin/tracking"
        />
        <CriticalCard
          label="Out for Delivery"
          value={String(s.outForDelivery)}
          sub="Complete today"
          tone="bg-amber-500 text-white dark:bg-amber-600"
          icon={<Send className="w-5 h-5" />}
          href="/admin/tracking"
        />
        <CriticalCard
          label="Exceptions"
          value={String(s.exception)}
          sub={s.exception > 0 ? "Needs attention" : "All clear"}
          tone={s.exception > 0 ? "bg-rose-500 text-white dark:bg-rose-600" : "bg-emerald-500 text-white dark:bg-emerald-600"}
          icon={<AlertTriangle className="w-5 h-5" />}
          href="/admin/tracking"
        />
        <CriticalCard
          label="Delivered"
          value={String(s.delivered)}
          sub={`${s.successRate}% on-time`}
          tone="bg-emerald-500 text-white dark:bg-emerald-600"
          icon={<CheckCircle2 className="w-5 h-5" />}
          href="/admin/shipments"
        />
      </div>

      {/* Tier 2 KPIs — secondary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5 sm:mb-7">
        <SecondaryCard label="Total Shipments" value={String(s.totalShipments)} sub={`${customers.length} customers`} tone="text-sky-600 dark:text-sky-300 bg-sky-500/10" icon={<Package className="w-4.5 h-4.5" />} />
        <SecondaryCard label="Total Users" value={String(s.totalUsers)} sub="Registered accounts" tone="text-indigo-600 dark:text-indigo-300 bg-indigo-500/10" icon={<Users className="w-4.5 h-4.5" />} />
        <SecondaryCard label="Revenue" value={formatCurrency(s.revenue, "USD")} sub={`${s.totalShipments} total billed`} tone="text-emerald-600 dark:text-emerald-300 bg-emerald-500/10" icon={<DollarSign className="w-4.5 h-4.5" />} />
        <SecondaryCard label="Avg. Delivery" value={`${s.avgDeliveryDays}d`} sub="Window fulfillment" tone="text-cyan-600 dark:text-cyan-300 bg-cyan-500/10" icon={<Clock className="w-4.5 h-4.5" />} />
      </div>

      {/* Charts Row (appears after operational lists on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5 mb-5 sm:mb-7 order-2 lg:order-1">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card">
          <div className="px-4 sm:px-5 pt-4 pb-3 flex items-center justify-between border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-[17px] leading-tight">Volume & Revenue</h3>
                <p className="text-[11px] text-muted-foreground">Last 6 months</p>
              </div>
            </div>
            <Link href="/admin/analytics" className="text-[11px] sm:text-xs inline-flex items-center gap-1 text-primary hover:underline font-medium">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-3 sm:p-5">
            <div className="h-56 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s.monthlyVolume} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} width={40} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12, border: "1px solid hsl(var(--border))",
                      fontSize: 12, background: "hsl(var(--card))",
                    }}
                  />
                  <Line type="monotone" dataKey="shipments" name="Shipments" stroke="#0B5FFF" strokeWidth={2.5} dot={{ r: 3, fill: "#0B5FFF" }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3, fill: "#06B6D4" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-border/60 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-[17px] leading-tight">Status Mix</h3>
              <p className="text-[11px] text-muted-foreground">Current distribution</p>
            </div>
          </div>
          <div className="p-3 sm:p-5">
            <div className="h-56 sm:h-72 flex items-center justify-center">
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {statusDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12, border: "1px solid hsl(var(--border))",
                        fontSize: 12, background: "hsl(var(--card))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
            </div>
            <div className="pt-3 grid grid-cols-2 gap-y-2 gap-x-3">
              {statusDistribution.slice(0, 6).map((e) => (
                <div key={e.name} className="flex items-center gap-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                  <span className="text-muted-foreground truncate">{e.name}</span>
                  <span className="ml-auto font-mono font-semibold">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments + Activity + Snapshot (mobile-first: shown before charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3.5 sm:gap-5 mb-5 sm:mb-7 order-1 lg:order-2">
        {/* Recent Shipments — cards on mobile, table on md+ */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 sm:px-5 py-4 flex items-center justify-between border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-[17px] leading-tight">Recent Shipments</h3>
                <p className="text-[11px] text-muted-foreground">Latest status updates</p>
              </div>
            </div>
            <Link href="/admin/shipments" className="text-[11px] sm:text-xs inline-flex items-center gap-1 text-primary hover:underline font-medium">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Tracking</th>
                  <th className="text-left font-medium px-5 py-3">Customer</th>
                  <th className="text-left font-medium px-5 py-3">Route</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                  <th className="text-right font-medium px-5 py-3">ETA</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.length === 0 && (
                  <tr><td colSpan={5} className="h-28 text-center text-sm text-muted-foreground">No shipments yet.</td></tr>
                )}
                {recentShipments.map((sh) => {
                  const cust = customers.find((c) => c.id === sh.customerId);
                  return (
                    <tr
                      key={sh.id}
                      onClick={() => router.push(`/admin/shipments/${sh.id}`)}
                      className="border-b border-border/40 last:border-b-0 hover:bg-accent/5 cursor-pointer transition"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-primary">{sh.trackingNumber}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-serif text-[11px] flex items-center justify-center">
                            {cust?.fullName?.[0] || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{cust?.fullName || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        <span className="truncate inline-block max-w-[160px]">{sh.origin.split(",")[0]} → {sh.destination.split(",")[0]}</span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={sh.status} /></td>
                      <td className="px-5 py-3.5 text-right text-muted-foreground">{formatDate(sh.estimatedDelivery)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2.5 p-3 sm:p-4">
            {recentShipments.length === 0 && (
              <div className="rounded-xl bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                No shipments yet.
              </div>
            )}
            {recentShipments.map((sh) => (
              <AdminShipmentCard
                key={sh.id}
                shipment={sh}
                customer={customers.find((c) => c.id === sh.customerId)}
                onClick={() => router.push(`/admin/shipments/${sh.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Top Destinations + Recent Users */}
        <div className="lg:col-span-2 space-y-3.5 sm:space-y-5">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-border/60 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-[17px] leading-tight">Top Destinations</h3>
                <p className="text-[11px] text-muted-foreground">Delivery volume</p>
              </div>
            </div>
            <div className="p-3 sm:p-5">
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s.topDestinations} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis type="category" dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis type="number" stroke="#888" fontSize={10} tickLine={false} axisLine={false} width={30} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12, border: "1px solid hsl(var(--border))",
                        fontSize: 12, background: "hsl(var(--card))",
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#0B5FFF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-border/60 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-[17px] leading-tight">New Users</h3>
                <p className="text-[11px] text-muted-foreground">Latest signups</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-1.5">
              {newUsers.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">No users yet.</div>}
              {newUsers.map((u) => {
                const count = shipments.filter((x) => x.customerId === u.id).length;
                return (
                  <button
                    key={u.id}
                    onClick={() => router.push(`/admin/users/${u.id}`)}
                    className="w-full flex items-center gap-3 rounded-xl p-2.5 hover:bg-accent/10 transition active:bg-accent/15 text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-serif flex items-center justify-center shrink-0">
                      {u.fullName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate leading-tight">{u.fullName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-muted-foreground">{count} sh.</p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(u.createdAt)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Activity + stats footer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-border/60 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-[17px] leading-tight">Recent Activity</h3>
              <p className="text-[11px] text-muted-foreground">Operational audit trail</p>
            </div>
          </div>
          <div className="p-3 sm:p-5">
            <div className="relative">
              <div className="absolute left-[22px] top-2 bottom-2 w-[2px] bg-border rounded-full hidden sm:block" />
              <ul className="space-y-4">
                {activity.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No recent activity.</li>}
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 relative">
                    <div className={cn("w-11 h-11 rounded-xl border inline-flex items-center justify-center shrink-0 z-10", ACTIVITY_TONE[a.type as string] ?? "border-border/80 bg-muted/40 text-primary")}>
                      {ACTIVITY_ICON[a.type as string] ?? <ShieldCheck className="w-4.5 h-4.5" />}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm leading-snug">
                          <span className="font-semibold">{a.actor}</span>
                          <span className="text-muted-foreground"> — </span>
                          {a.action}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                          {formatDateTime(a.timestamp)}
                        </span>
                      </div>
                      {a.details && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.details}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-5">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground inline-flex items-center justify-center shadow-md shadow-primary/25">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-[17px] leading-tight">This Month</h3>
                <p className="text-[11px] text-muted-foreground">Performance snapshot</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <SnapMetric label="Shipments" value={String(s.monthlyVolume[5]?.shipments || 0)} accent="text-sky-600 dark:text-sky-300" />
              <SnapMetric label="Revenue" value={formatCurrency(s.monthlyVolume[5]?.revenue || 0, "USD")} accent="text-emerald-600 dark:text-emerald-300" />
              <SnapMetric label="New Users" value={String(s.monthlyVolume[5]?.customers || 0)} accent="text-indigo-600 dark:text-indigo-300" />
              <SnapMetric label="Success Rate" value={`${s.successRate}%`} accent="text-cyan-600 dark:text-cyan-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/admin/activity"
              className="rounded-2xl border border-border bg-card p-4 hover:bg-accent/5 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold">Activity Log</p>
              </div>
              <p className="text-xs text-muted-foreground">Full audit trail of events</p>
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-2xl border border-border bg-card p-4 hover:bg-accent/5 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold">System Settings</p>
              </div>
              <p className="text-xs text-muted-foreground">Shipping, zones & security</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CriticalCard({
  label, value, sub, tone, icon, href,
}: {
  label: string; value: string; sub?: string; tone: string; icon: React.ReactNode; href: string;
}) {
  return (
    <Link href={href} className="group relative rounded-2xl p-3.5 sm:p-4 shadow-lg shadow-black/[0.03] transition active:scale-[0.98] overflow-hidden">
      <div className={cn("absolute inset-0", tone)} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative flex items-start justify-between gap-3 mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 inline-flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 opacity-70 group-hover:translate-x-0.5 transition shrink-0 mt-1" />
      </div>
      <div className="relative">
        <p className="text-2xl sm:text-3xl font-serif font-bold tracking-tight leading-none mb-1.5">{value}</p>
        <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.12em] opacity-85">{label}</p>
        {sub && <p className="text-[11px] opacity-75 mt-1.5">{sub}</p>}
      </div>
    </Link>
  );
}

function SecondaryCard({
  label, value, sub, tone, icon,
}: {
  label: string; value: string; sub?: string; tone: string; icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 transition hover:border-border/80">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-8 h-8 sm:w-9 sm:h-9 rounded-xl inline-flex items-center justify-center", tone)}>
          {icon}
        </div>
      </div>
      <p className="text-xl sm:text-[22px] font-serif font-semibold tracking-tight leading-none mb-1 truncate">{value}</p>
      <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-0.5">{label}</p>
      {sub && <p className="text-[10px] sm:text-[11px] text-muted-foreground/90">{sub}</p>}
    </div>
  );
}

function SnapMetric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl bg-card/80 border border-border/60 p-2.5 sm:p-3">
      <p className={`text-[11px] font-medium uppercase tracking-[0.12em] mb-1 ${accent}`}>{label}</p>
      <p className="text-base sm:text-lg font-serif font-semibold leading-tight truncate">{value}</p>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
