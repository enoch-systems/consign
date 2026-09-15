"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { StatusBadge, formatCurrency, formatDate } from "@/components/shared/status-badge";
import type { ShipmentStatus } from "@/lib/types";
import { AdminPageHeader } from "@/components/shared/admin/admin-page-header";
import { AdminSearch } from "@/components/shared/admin/admin-search";
import { AdminShipmentCard } from "@/components/shared/admin/admin-shipment-card";
import {
  Package, Users, Truck, Plus, ChevronRight,
  Send, Clock, AlertTriangle, CheckCircle2, X, Filter as FilterIcon,
} from "lucide-react";

const STATUSES: (ShipmentStatus | "All")[] = [
  "All",
  "Order Created",
  "Confirmed",
  "Picked Up",
  "In Transit",
  "Arrived at Facility",
  "Out for Delivery",
  "Delivered",
  "Exception",
];

function AdminShipmentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shipments, customers, adminStats } = useAppState();
  const s = adminStats();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [f, setF] = useState<ShipmentStatus | "All">("All");
  const [sheetOpen, setSheetOpen] = useState(false);

  const list = useMemo(() => {
    return [...shipments]
      .filter((sh) => f === "All" || sh.status === f)
      .filter((sh) => {
        if (!q.trim()) return true;
        const t = q.trim().toLowerCase();
        const cust = customers.find((c) => c.id === sh.customerId);
        return (
          sh.trackingNumber.toLowerCase().includes(t) ||
          sh.destination.toLowerCase().includes(t) ||
          sh.origin.toLowerCase().includes(t) ||
          cust?.fullName.toLowerCase().includes(t) ||
          cust?.email.toLowerCase().includes(t)
        );
      })
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [shipments, f, q, customers]);

  return (
    <div className="max-w-[1400px] mx-auto pb-10 sm:pb-14">
      <AdminPageHeader
        title="Shipments"
        subtitle={
          <>
            {shipments.length} total · <span className="text-foreground font-medium">{s.active}</span> active ·{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{s.delivered}</span> delivered
          </>
        }
        actions={
          <Link
            href="/customer/shipments/new"
            className="inline-flex items-center justify-center gap-1.5 h-11 px-4 sm:px-5 flex-1 sm:flex-none rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/92 shadow-lg shadow-primary/20 transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="w-4 h-4" />
            Create Shipment
          </Link>
        }
      />

      {/* Quick filters (mobile scroll, desktop wrap) */}
      <div className="-mx-3 sm:mx-0 mb-4 sm:mb-5 overflow-x-auto">
        <div className="flex gap-2 px-3 sm:px-0 min-w-max sm:min-w-0 sm:flex-wrap">
          {STATUSES.map((st) => {
            const count = st === "All" ? shipments.length : shipments.filter((x) => x.status === st).length;
            const active = f === st;
            return (
              <button
                key={st}
                onClick={() => setF(st)}
                className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition active:scale-[0.97] ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted/50 hover:bg-muted text-foreground/80 hover:text-foreground border border-border/70"
                }`}
              >
                {st}
                <span className={active ? "opacity-80" : "text-muted-foreground"}>{count}</span>
              </button>
            );
          })}
          <button
            onClick={() => setSheetOpen(true)}
            className="sm:hidden inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-medium bg-muted/50 hover:bg-muted border border-border/70 shrink-0"
          >
            <FilterIcon className="w-3.5 h-3.5" /> More
          </button>
        </div>
      </div>

      {/* Search + result count */}
      <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <AdminSearch
          value={q}
          onChange={setQ}
          placeholder="Tracking, customer, destination…"
          className="sm:max-w-md w-full"
        />
        <p className="text-xs sm:text-sm text-muted-foreground sm:text-right">
          Showing <span className="text-foreground font-semibold">{list.length}</span> of {shipments.length} shipments
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="text-left font-medium px-5 py-3.5">Tracking</th>
                <th className="text-left font-medium px-5 py-3.5">Customer</th>
                <th className="text-left font-medium px-5 py-3.5">Route</th>
                <th className="text-left font-medium px-5 py-3.5">Status</th>
                <th className="text-left font-medium px-5 py-3.5">Method</th>
                <th className="text-left font-medium px-5 py-3.5">Created</th>
                <th className="text-left font-medium px-5 py-3.5">ETA</th>
                <th className="text-right font-medium px-5 py-3.5">Cost</th>
              </tr>
            </thead>
            <tbody>
              {!list.length && (
                <tr>
                  <td colSpan={8} className="h-40 text-center text-sm text-muted-foreground">
                    No shipments match your filters.
                  </td>
                </tr>
              )}
              {list.map((sh) => {
                const cust = customers.find((c) => c.id === sh.customerId);
                return (
                  <tr
                    key={sh.id}
                    onClick={() => router.push(`/admin/shipments/${sh.id}`)}
                    className="border-b border-border/40 last:border-b-0 hover:bg-accent/5 cursor-pointer transition"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold text-primary">{sh.trackingNumber}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-serif text-[11px] flex items-center justify-center shrink-0">
                          {cust?.fullName?.[0] || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate leading-tight">{cust?.fullName || "—"}</p>
                          <p className="text-xs text-muted-foreground truncate">{cust?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Truck className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span>{sh.origin.split(",")[0]} → {sh.destination.split(",")[0]}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={sh.status} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{sh.shippingMethod}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{formatDate(sh.createdAt)}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{formatDate(sh.estimatedDelivery)}</td>
                    <td className="px-5 py-3.5 text-right font-medium">{formatCurrency(sh.cost, sh.currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile shipment cards */}
      <div className="md:hidden space-y-2.5">
        {!list.length && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No shipments match.
          </div>
        )}
        {list.map((sh) => (
          <AdminShipmentCard
            key={sh.id}
            shipment={sh}
            customer={customers.find((c) => c.id === sh.customerId)}
            onClick={() => router.push(`/admin/shipments/${sh.id}`)}
          />
        ))}
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setSheetOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border p-4 pb-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20 mx-auto mb-4" />
            <h3 className="font-serif text-xl mb-4">Filter Shipments</h3>
            <div className="space-y-2 mb-6">
              {STATUSES.map((st) => {
                const count = st === "All" ? shipments.length : shipments.filter((x) => x.status === st).length;
                const active = f === st;
                return (
                  <button
                    key={st}
                    onClick={() => { setF(st); setSheetOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {st === "Exception" && <AlertTriangle className="w-4 h-4" />}
                      {st === "Delivered" && <CheckCircle2 className="w-4 h-4" />}
                      {st === "Out for Delivery" && <Send className="w-4 h-4" />}
                      {st}
                    </span>
                    <span className={active ? "opacity-80" : "text-muted-foreground"}>{count}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSheetOpen(false)}
              className="w-full h-11 rounded-xl border border-border text-sm font-medium hover:bg-accent/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, icon, align = "left" }: { label: string; value: string; icon?: React.ReactNode; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-0.5 flex items-center gap-1" style={align === "right" ? { justifyContent: "flex-end" } : undefined}>
        {icon}
        {label}
      </p>
      <p className="text-xs font-semibold truncate">{value}</p>
    </div>
  );
}
export default function AdminShipmentsPage() {
  return (
    <Suspense fallback={null}>
      <AdminShipmentsPageContent />
    </Suspense>
  );
}
