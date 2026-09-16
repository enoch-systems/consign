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
        <section className="relative border-b border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.1),transparent_28%),linear-gradient(to_bottom,_rgba(14,116,144,0.04),_transparent_40%),hsl(var(--background))]">
          <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-12 sm:pb-14 max-w-7xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Shipment Tracking</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-mono text-foreground">{shipment.trackingNumber}</span>
            </div>

            <div className="rounded-[30px] border border-border/60 bg-card/80 backdrop-blur-sm shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold ring-1 ring-primary/20">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono">{shipment.trackingNumber}</span>
                    </span>
                    <StatusBadge status={shipment.status} />
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground mb-2">Shipment Status</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Last updated <span className="font-medium text-foreground">{formatDateTime(shipment.lastUpdated)}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button asChild variant="outline" size="sm" className="rounded-full h-11 px-4">
                    <Link href="/customer/shipments/new"><Package className="w-4 h-4 mr-2" />New Shipment</Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-full h-11 px-4 bg-primary hover:bg-primary/90">
                    <Link href="/"><Home className="w-4 h-4 mr-2" />Back to Home</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-7">
                <RouteBar shipment={shipment} />
              </div>

              <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
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
          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.55fr] gap-6 xl:gap-8">
            <div className="space-y-6">
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
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Instructions</p>
                    <p className="text-sm text-foreground/90">{shipment.instructions}</p>
                  </div>
                )}
              </InfoCard>
            </div>

            <div className="xl:col-span-1">
              <Card className="boty-shadow border border-border/60 bg-card/90 xl:sticky xl:top-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 font-serif text-xl">
                    <span className="inline-flex w-9 h-9 rounded-xl bg-primary/10 text-primary items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </span>
                    Tracking Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
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
    <div className="rounded-2xl border border-border/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.7),_rgba(248,250,252,0.9))] dark:bg-muted/20 p-3 sm:p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground text-[10px] sm:text-xs mb-2 uppercase tracking-[0.18em]">
        <span className="text-primary/80">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="font-semibold text-sm sm:text-base text-foreground truncate">{value}</p>
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
    <div className="rounded-3xl border border-border/60 bg-background/60 p-4 sm:p-5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
        <div className="text-left min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">Origin</p>
          <p className="font-semibold text-sm sm:text-base text-foreground truncate">{origin}</p>
        </div>
        <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-cyan-500 to-accent" style={{ width: `${pct}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center border-2 border-background transition-all duration-500"
            style={{ left: `calc(${pct}% - 14px)` }}
          >
            <Truck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-right min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">Destination</p>
          <p className="font-semibold text-sm sm:text-base text-foreground truncate">{dest}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="boty-shadow border border-border/60 bg-card/85 shadow-[0_14px_35px_-24px_rgba(15,23,42,0.45)]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-serif text-xl">
          <span className="inline-flex w-8 h-8 rounded-xl bg-primary/10 text-primary items-center justify-center">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">{children}</CardContent>
    </Card>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-background/60 px-3 py-2.5">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words text-foreground/90">{value}</p>
      </div>
    </div>
  );
}
