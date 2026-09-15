"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Bell, MapPinned, PackageCheck, ShieldCheck, Truck, Users } from "lucide-react"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Active shipments", value: "2,438", change: "+6.4% vs last week", icon: PackageCheck },
  { label: "On-time delivery", value: "98.4%", change: "+1.2 pts", icon: ShieldCheck },
  { label: "Active customers", value: "1,280", change: "+18 this month", icon: Users },
]

const recentShipments = [
  { id: "LGX8429137", customer: "Harborline Nigeria", route: "Lagos → Dubai", status: "In transit", updated: "12 mins ago" },
  { id: "KRA4410281", customer: "BluePeak Logistics", route: "Abuja → Accra", status: "Needs review", updated: "32 mins ago" },
  { id: "NPL9056274", customer: "PrimeGoods", route: "Port Harcourt → London", status: "Delivered", updated: "1 hr ago" },
]

const lanes = [
  { origin: "Lagos", destination: "London", eta: "2 days", status: "On time", tone: "bg-emerald-500" },
  { origin: "Abuja", destination: "Dubai", eta: "3 days", status: "In transit", tone: "bg-amber-500" },
  { origin: "Port Harcourt", destination: "Accra", eta: "1 day", status: "On time", tone: "bg-emerald-500" },
  { origin: "Kano", destination: "New York", eta: "4 days", status: "Processing", tone: "bg-sky-500" },
]

const alerts = [
  { title: "Customs clearance", detail: "Two export consignments require document review before release." },
  { title: "Warehouse handoff", detail: "Inbound loads at Ikeja terminal are scheduled for dispatch review." },
  { title: "Delivery confirmation", detail: "Three customer deliveries require proof-of-delivery validation today." },
]

export default function HomePage() {
  const router = useRouter()
  const [tracking, setTracking] = useState("")

  const onTrack = (event: FormEvent) => {
    event.preventDefault()
    const value = tracking.trim().toUpperCase()
    if (!value) return
    router.push(`/track/${value}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="rounded-3xl border bg-primary px-6 py-8 text-primary-foreground shadow-sm md:px-8 md:py-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-2.5 py-1 text-sm text-primary-foreground/80">
                <span className="size-2 rounded-full bg-emerald-400" />
                All systems operational
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Operations command center.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-primary-foreground/80 md:text-base">
                Track consignments, coordinate handoffs, and maintain full visibility across domestic and international movements.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/signup">
                  Book shipment
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/track">Track shipment</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, change, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center justify-between gap-4 pt-6">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">{change} this week</p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Overview</p>
                <CardTitle>Operations summary</CardTitle>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <span className="size-2 rounded-full bg-emerald-500" />
                Stable
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-secondary/40 p-4">
                  <p className="text-sm text-muted-foreground">Network volume</p>
                  <p className="mt-2 text-2xl font-semibold">846</p>
                  <p className="mt-1 text-xs text-muted-foreground">Consignments processed this month</p>
                </div>
                <div className="rounded-2xl border bg-secondary/40 p-4">
                  <p className="text-sm text-muted-foreground">Exceptions</p>
                  <p className="mt-2 text-2xl font-semibold">12</p>
                  <p className="mt-1 text-xs text-muted-foreground">Across domestic and export lanes</p>
                </div>
              </div>

              <div className="space-y-3">
                {lanes.map(({ origin, destination, eta, status, tone }) => (
                  <div key={`${origin}-${destination}`} className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-2.5 rounded-full ${tone}`} />
                      <div>
                        <p className="font-medium">{origin} → {destination}</p>
                        <p className="text-xs text-muted-foreground">ETA {eta}</p>
                      </div>
                    </div>
                    <span className="rounded-full border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track a shipment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onTrack} className="space-y-3">
                  <Input
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="Tracking number"
                  />
                  <Button type="submit" className="w-full">
                    Look up shipment
                  </Button>
                </form>
                <p className="mt-3 text-xs text-muted-foreground">Example tracking number: LGX8429137</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>Priority actions</CardTitle>
                <Bell className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.title} className="rounded-xl border bg-secondary/30 p-3">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-1 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground">Recent activity</p>
              <h2 className="text-xl font-semibold tracking-tight">Latest consignments</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">View all</Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Tracking</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-t">
                    <td className="px-4 py-3 font-mono text-primary">
                      <Link href={`/track/${shipment.id}`} className="hover:underline">
                        {shipment.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{shipment.customer}</td>
                    <td className="px-4 py-3">{shipment.route}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          shipment.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : shipment.status === "Needs review"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{shipment.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="lanes" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Network lanes</p>
              <h2 className="text-xl font-semibold tracking-tight">Active routes</h2>
            </div>
            <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
              Service catalog
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {lanes.map(({ origin, destination, eta, status }) => (
              <Card key={`${origin}-${destination}`} className="h-full">
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPinned className="size-4 text-primary" />
                      <span className="text-sm font-medium">{origin}</span>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                    <span className="text-sm">{destination}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>ETA</span>
                    <span className="font-medium text-foreground">{eta}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Status</span>
                    <span className="rounded-full border bg-secondary px-2 py-1 text-xs font-medium">{status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
