"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAppState } from "@/lib/app-state";
import { StatusBadge, formatCurrency, formatDate, formatDateTime } from "@/components/shared/status-badge";
import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, MapPin, ArrowRight, Scale, Clock, Hash, User, Phone, Mail, Search, Home, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const trackingNumber = decodeURIComponent(String(params.trackingNumber || ""));
  const { findShipmentByTracking, findCustomerById } = useAppState();
  const shipment = findShipmentByTracking(trackingNumber);

  if (!shipment) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header variant="default" />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-lg boty-shadow border">
            <CardContent className="pt-10 pb-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl mb-2">Shipment Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t locate a shipment with tracking number{" "}
                <span className="font-mono font-semibold text-foreground">{trackingNumber || "(empty)"}</span>.
                Please double-check and try again.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {["LGX8429137", "NG45678291", "LGS9201847"].map((n) => (
                  <Button
                    key={n}
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/track/${n}`)}
                    className="rounded-full"
                  >
                    Try {n}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 justify-center">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/"><Home className="w-4 h-4 mr-2" />Home</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/#track">Track Another</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const customer = findCustomerById(shipment.customerId);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header variant="default" />
      <main className="flex-1">
        <section className="relative border-b bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background">
          <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-12 sm:pb-14 max-w-7xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Shipment Tracking</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-mono text-foreground">{shipment.trackingNumber}</span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono">{shipment.trackingNumber}</span>
                  </span>
                  <StatusBadge status={shipment.status} />
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl tracking-tight mb-1">Shipment Status</h1>
                <p className="text-muted-foreground">
                  Last updated <span className="font-medium text-foreground">{formatDateTime(shipment.lastUpdated)}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href="/customer/shipments/new"><Package className="w-4 h-4 mr-2" />New Shipment</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <Link href="/customer/dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl boty-shadow border bg-card p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
                <RouteBar shipment={shipment} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
                <StatChip icon={<Truck className="w-4 h-4" />} label="Method" value={shipment.shippingMethod} />
                <StatChip icon={<Scale className="w-4 h-4" />} label="Weight" value={`${shipment.weight}kg`} />
                <StatChip icon={<Package className="w-4 h-4" />} label="Type" value={shipment.packageType} />
                <StatChip icon={<Clock className="w-4 h-4" />} label="ETA" value={formatDate(shipment.estimatedDelivery)} />
                <StatChip icon={<MapPin className="w-4 h-4" />} label="Current" value={shipment.currentLocation.split(",")[0]} />
                <StatChip icon={<Package className="w-4 h-4" />} label="Cost" value={formatCurrency(shipment.cost, shipment.currency)} />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 sm:py-14 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <InfoCard title="Sender" icon={<User className="w-4 h-4" />}>
                <InfoRow label="Name" value={shipment.sender.name} />
                <InfoRow label="Phone" value={shipment.sender.phone} icon={<Phone className="w-3.5 h-3.5" />} />
                <InfoRow label="Email" value={shipment.sender.email} icon={<Mail className="w-3.5 h-3.5" />} />
                <InfoRow label="Address" value={`${shipment.sender.address}, ${shipment.sender.city}, ${shipment.sender.state}, ${shipment.sender.country}`} />
              </InfoCard>

              <InfoCard title="Recipient" icon={<User className="w-4 h-4" />}>
                <InfoRow label="Name" value={shipment.recipient.name} />
                <InfoRow label="Phone" value={shipment.recipient.phone} icon={<Phone className="w-3.5 h-3.5" />} />
                <InfoRow label="Email" value={shipment.recipient.email} icon={<Mail className="w-3.5 h-3.5" />} />
                <InfoRow label="Address" value={`${shipment.recipient.address}, ${shipment.recipient.city}, ${shipment.recipient.state}, ${shipment.recipient.country}`} />
              </InfoCard>

              <InfoCard title="Package & Cost" icon={<Package className="w-4 h-4" />}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <InfoRow label="Type" value={shipment.packageType} />
                  <InfoRow label="Weight" value={`${shipment.weight} kg`} />
                  <InfoRow label="Dimensions" value={shipment.dimensions} />
                  <InfoRow label="Packages" value={String(shipment.packageCount)} />
                  <InfoRow label="Method" value={shipment.shippingMethod} />
                  <InfoRow label="Cost" value={formatCurrency(shipment.cost, shipment.currency)} />
                </div>
                {shipment.instructions && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Instructions</p>
                    <p className="text-sm">{shipment.instructions}</p>
                  </div>
                )}
              </InfoCard>
            </div>

            <div className="lg:col-span-3">
              <Card className="boty-shadow border lg:sticky lg:top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif text-xl">
                    <span className="inline-flex w-8 h-8 rounded-lg bg-primary/10 text-primary items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </span>
                    Tracking Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TrackingTimeline events={shipment.trackingEvents} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/60 dark:bg-muted/20 p-3 sm:p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
        <span className="text-primary/80">{icon}</span>
        <span className="uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-semibold text-sm sm:text-base truncate">{value}</p>
    </div>
  );
}

function RouteBar({ shipment }: { shipment: any }) {
  const { sender, recipient, trackingEvents } = shipment;
  const origin = `${sender.city}, ${sender.country}`;
  const dest = `${recipient.city}, ${recipient.country}`;
  const completed = trackingEvents.filter((e: any) => e.state === "completed").length;
  const pct = Math.min(100, Math.round((completed / Math.max(trackingEvents.length - 1, 1)) * 100));

  return (
    <div className="col-span-full">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
        <div className="text-left min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Origin</p>
          <p className="font-semibold text-sm sm:text-base truncate">{origin}</p>
        </div>
        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div className="absolute inset-y-0 left-0 timeline-line rounded-full" style={{ width: `${pct}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center border-2 border-background transition-all duration-500"
            style={{ left: `calc(${pct}% - 14px)` }}
          >
            <Truck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-right min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Destination</p>
          <p className="font-semibold text-sm sm:text-base truncate">{dest}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="boty-shadow border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <span className="inline-flex w-7 h-7 rounded-lg bg-primary/10 text-primary items-center justify-center">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] sm:text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
