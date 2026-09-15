"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, formatCurrency, formatDate, formatDateTime } from "@/components/shared/status-badge";
import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import type { ShipmentStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Package, Truck, MapPin, ArrowLeft, ArrowRight, Scale, Clock, Hash, User, Phone, Mail,
  ChevronRight, Edit3, History, Users, AlertTriangle, Send, CheckCircle2,
  Loader2, Navigation, Banknote, CircleDot, Building2,
} from "lucide-react";

const STATUSES: ShipmentStatus[] = [
  "Order Created", "Confirmed", "Picked Up", "In Transit",
  "Arrived at Facility", "Out for Delivery", "Delivered", "Exception",
];

export default function AdminShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "");
  const { findShipmentById, updateShipmentStatus, customers, shipments } = useAppState();
  const shipment = findShipmentById(id);
  const [next, setNext] = useState<ShipmentStatus | "">("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const customer = useMemo(
    () => (shipment ? customers.find((c) => c.id === shipment.customerId) : undefined),
    [shipment, customers],
  );

  const progress = useMemo(() => {
    if (!shipment) return 0;
    const done = shipment.trackingEvents.filter((e) => e.state === "completed").length;
    const total = Math.max(shipment.trackingEvents.length - 1, 1);
    return Math.min(100, Math.round((done / total) * 100));
  }, [shipment]);

  const nextActions = useMemo(() => {
    if (!shipment) return [] as ShipmentStatus[];
    const idx = STATUSES.indexOf(shipment.status);
    const suggestions: ShipmentStatus[] = [];
    if (idx + 1 < STATUSES.length - 1) suggestions.push(STATUSES[idx + 1]);
    if (shipment.status !== "Delivered" && shipment.status !== "Exception") {
      if (!suggestions.includes("Delivered")) suggestions.push("Delivered");
      if (!suggestions.includes("Exception")) suggestions.push("Exception");
    }
    return suggestions;
  }, [shipment]);

  if (!shipment) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-12 sm:py-16 text-center">
        <Card className="border rounded-2xl shadow-sm">
          <CardContent className="pt-10 pb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-2xl mb-2">Shipment Not Found</h1>
            <p className="text-muted-foreground text-sm mb-5">
              The shipment you are looking for does not exist or has been removed.
            </p>
            <Button asChild variant="outline" className="rounded-full h-11">
              <Link href="/admin/shipments">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shipments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const apply = () => {
    if (!next) {
      toast.error("Choose a new status before applying.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const loc =
        location.trim() ||
        (STATUSES.indexOf(next) <= 1
          ? shipment.origin
          : next === "Delivered"
            ? shipment.destination
            : shipment.currentLocation);
      const res = updateShipmentStatus(shipment.id, next, loc);
      setSaving(false);
      setNext("");
      setLocation("");
      if (res) {
        toast.success(`Status updated to "${next}"`, {
          description: `Timeline, ${customer?.fullName || "customer"} notifications & dashboards updated.`,
          action: { label: "View", onClick: () => router.push(`/track/${res.trackingNumber}`) },
        });
      } else {
        toast.error("Could not update status.");
      }
    }, 300);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pb-10 sm:pb-14">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 mt-1">
        <Link href="/admin" className="hover:text-foreground transition">
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/shipments" className="hover:text-foreground transition">
          Shipments
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-mono text-foreground">{shipment.trackingNumber}</span>
      </div>

      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full h-10 w-10 p-0 shrink-0"
            href="/admin/shipments"
            aria-label="Back"
          >
            <Link href="/admin/shipments">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                <Hash className="w-3 h-3" />
                <span className="font-mono tracking-tight">{shipment.trackingNumber}</span>
              </span>
              <StatusBadge status={shipment.status} />
            </div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight leading-tight">
              Shipment Operations
            </h1>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full h-11 flex-1 sm:flex-none"
            href={`/track/${shipment.trackingNumber}`}
          >
            <Link href={`/track/${shipment.trackingNumber}`}>
              Public View
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile: Sticky status update action immediately visible under header */}
      <Card className="lg:hidden border rounded-2xl shadow-sm mb-4 sticky top-[57px] z-20 bg-card/95 backdrop-blur">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">Update Status</p>
              <p className="text-[11px] text-muted-foreground truncate">One-hand operation</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            <Select value={next} onValueChange={(v) => setNext(v as ShipmentStatus)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select new status…" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.filter((st) => st !== shipment.status).map((st) => (
                  <SelectItem key={st} value={st}>
                    <span className="flex items-center gap-2">
                      <StatusBadge status={st} className="!text-[11px] !py-0.5" />
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 rounded-xl text-sm"
              placeholder={`Location · default: ${shipment.currentLocation.split(",")[0]}`}
            />
            <div className="grid grid-cols-4 gap-2">
              {nextActions.slice(0, 4).map((st) => (
                <button
                  key={st}
                  onClick={() => setNext(st)}
                  className={`h-11 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center transition ${
                    next === st
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-muted/60 hover:bg-muted text-foreground"
                  }`}
                >
                  <StatusIcon status={st} />
                  <span className="mt-0.5 leading-none">
                    {st === "Out for Delivery" ? "OFD" : st.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
            <Button
              onClick={apply}
              className="h-12 rounded-xl bg-gradient-to-r from-primary to-cyan-500 hover:opacity-95 text-white font-semibold shadow-md shadow-primary/20"
              disabled={saving || !next}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Apply Update
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Route card — highest priority info on mobile */}
      <Card className="border rounded-2xl shadow-sm mb-4 sm:mb-5 bg-gradient-to-br from-primary/[0.035] via-background to-cyan-500/[0.04] overflow-hidden">
        <CardContent className="pt-5 sm:pt-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-start md:items-center mb-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CircleDot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                  Origin
                </p>
                <p className="text-base sm:text-lg font-semibold leading-tight">
                  {shipment.sender.city}, {shipment.sender.country}
                </p>
                <p className="text-xs text-muted-foreground truncate">{shipment.sender.address}</p>
              </div>
            </div>

            <div className="relative w-full md:w-80 md:mx-2 my-1 md:my-0 order-3 md:order-2">
              <div className="relative h-11 md:h-14">
                <div className="absolute left-6 md:left-8 right-6 md:right-8 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-cyan-400 to-emerald-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 text-white shadow-lg shadow-primary/30 flex items-center justify-center border-[3px] border-card"
                  style={{ left: `calc(${Math.min(92, progress)}% - 20px)` }}
                >
                  <Truck className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <p className="text-center text-[11px] text-muted-foreground mt-1">
                <span className="font-mono font-semibold text-foreground">{progress}%</span> of route completed
              </p>
            </div>

            <div className="flex items-start gap-3 md:justify-end md:text-right order-2 md:order-3">
              <div className="md:hidden w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="min-w-0 md:max-w-[90%]">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                  Destination
                </p>
                <p className="text-base sm:text-lg font-semibold leading-tight">
                  {shipment.recipient.city}, {shipment.recipient.country}
                </p>
                <p className="text-xs text-muted-foreground truncate">{shipment.recipient.address}</p>
              </div>
            </div>
          </div>

          {/* Key chips — reflowed for mobile 2×4 then lg 1×7 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3">
            <Chip label="Method" value={shipment.shippingMethod} icon={<Truck className="w-3.5 h-3.5" />} />
            <Chip
              label="Current Loc."
              value={shipment.currentLocation.split(",")[0]}
              icon={<MapPin className="w-3.5 h-3.5" />}
            />
            <Chip label="Weight" value={`${shipment.weight}kg`} icon={<Scale className="w-3.5 h-3.5" />} />
            <Chip
              label="Packages"
              value={String(shipment.packageCount)}
              icon={<Package className="w-3.5 h-3.5" />}
            />
            <Chip
              label="ETA"
              value={formatDate(shipment.estimatedDelivery)}
              icon={<Clock className="w-3.5 h-3.5" />}
            />
            <Chip
              label="Cost"
              value={formatCurrency(shipment.cost, shipment.currency)}
              icon={<Banknote className="w-3.5 h-3.5" />}
            />
            <Chip
              label="Last Update"
              value={formatDateTime(shipment.lastUpdated)}
              icon={<History className="w-3.5 h-3.5" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop-only status update panel */}
      <Card className="hidden lg:block border rounded-2xl shadow-sm mb-5 overflow-hidden">
        <CardHeader className="bg-muted/25 border-b px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="font-serif text-lg">Update Shipment Status</CardTitle>
                <CardDescription className="mt-0.5 text-xs sm:text-sm">
                  Changes propagate to tracking timeline, customer notifications & analytics immediately.
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {nextActions.map((st) => (
                <Button
                  key={st}
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 gap-2"
                  onClick={() => setNext(st)}
                >
                  <StatusIcon status={st} />
                  Jump to {st}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5 space-y-2">
              <label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                New Status
              </label>
              <Select value={next} onValueChange={(v) => setNext(v as ShipmentStatus)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Choose next status…" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.filter((st) => st !== shipment.status).map((st) => (
                    <SelectItem key={st} value={st}>
                      <span className="flex items-center gap-2">
                        <StatusBadge status={st} className="!text-[11px] !py-0.5" />
                        {st}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-5 space-y-2">
              <label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                Location (optional)
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 rounded-xl"
                placeholder={shipment.currentLocation}
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                onClick={apply}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-cyan-500 hover:opacity-95 text-white font-semibold shadow-md shadow-primary/20"
                disabled={saving || !next}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Apply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content grid: mobile timeline first, lg left-col info cards + right timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Timeline — highest priority, shown first on mobile */}
        <Card className="border rounded-2xl shadow-sm lg:col-span-7 order-1 lg:order-2 overflow-hidden">
          <CardHeader className="border-b bg-muted/15 px-5 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-9 h-9 rounded-xl bg-primary/10 text-primary items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </span>
                <div>
                  <CardTitle className="font-serif text-lg sm:text-xl">Tracking Timeline</CardTitle>
                  <CardDescription className="mt-0.5 text-xs sm:text-sm">
                    {shipment.trackingEvents.filter((e) => e.state === "completed").length} of{" "}
                    {shipment.trackingEvents.length} steps completed
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <TrackingTimeline events={shipment.trackingEvents} />
          </CardContent>
        </Card>

        {/* Secondary info column */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-4 sm:space-y-5">
          {customer && (
            <Card className="border rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-muted/10 px-5 py-3.5">
                <CardTitle className="font-serif text-base sm:text-lg flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary shrink-0" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <button
                  onClick={() => router.push(`/admin/users/${customer.id}`)}
                  className="w-full text-left rounded-2xl hover:bg-muted/30 p-3 sm:p-4 transition -mx-1"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary font-serif text-lg flex items-center justify-center shrink-0 border border-primary/15">
                      {customer.fullName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm sm:text-base">{customer.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <InfoCard title="Sender" icon={<User className="w-4 h-4" />}>
              <InfoRow label="Name" value={shipment.sender.name} />
              <InfoRow label="Phone" value={shipment.sender.phone} icon={<Phone className="w-3.5 h-3.5" />} />
              <InfoRow label="Email" value={shipment.sender.email} icon={<Mail className="w-3.5 h-3.5" />} />
              <InfoRow
                label="Address"
                value={`${shipment.sender.address}, ${shipment.sender.city}, ${shipment.sender.state}, ${shipment.sender.country}`}
              />
            </InfoCard>

            <InfoCard title="Recipient" icon={<User className="w-4 h-4" />}>
              <InfoRow label="Name" value={shipment.recipient.name} />
              <InfoRow
                label="Phone"
                value={shipment.recipient.phone}
                icon={<Phone className="w-3.5 h-3.5" />}
              />
              <InfoRow
                label="Email"
                value={shipment.recipient.email}
                icon={<Mail className="w-3.5 h-3.5" />}
              />
              <InfoRow
                label="Address"
                value={`${shipment.recipient.address}, ${shipment.recipient.city}, ${shipment.recipient.state}, ${shipment.recipient.country}`}
              />
            </InfoCard>
          </div>

          <InfoCard
            title="Package & Cost"
            icon={<Package className="w-4 h-4" />}
            accent
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              <InfoRow label="Type" value={shipment.packageType} />
              <InfoRow label="Weight" value={`${shipment.weight} kg`} />
              <InfoRow label="Dimensions" value={shipment.dimensions} />
              <InfoRow label="Packages" value={String(shipment.packageCount)} />
              <InfoRow label="Method" value={shipment.shippingMethod} />
              <InfoRow label="Cost" value={formatCurrency(shipment.cost, shipment.currency)} />
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: ShipmentStatus }) {
  switch (status) {
    case "Delivered":
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    case "In Transit":
      return <Truck className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />;
    case "Out for Delivery":
      return <Send className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    case "Exception":
      return <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
    case "Arrived at Facility":
      return <Building2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />;
    default:
      return <CircleDot className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
  }
}

function Chip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-card dark:bg-muted/15 p-3 sm:p-3.5">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-semibold mb-1.5">
        <span className="text-primary/80 shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <p className="font-semibold text-[13px] sm:text-sm truncate leading-tight">{value}</p>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  children,
  accent,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className={`border rounded-2xl shadow-sm overflow-hidden ${accent ? "" : ""}`}>
      <CardHeader className="border-b bg-muted/10 px-5 py-3.5">
        <CardTitle className="flex items-center gap-2 font-serif text-base sm:text-lg leading-tight">
          <span className="inline-flex w-7 h-7 rounded-lg bg-primary/10 text-primary items-center justify-center shrink-0">
            {icon}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-3.5">{children}</CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 text-muted-foreground shrink-0 w-4 h-4 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
          {label}
        </p>
        <p className="text-sm font-medium break-words leading-snug">{value}</p>
      </div>
    </div>
  );
}
