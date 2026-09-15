"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Truck } from "lucide-react"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    id: "priority-express",
    title: "Priority Express",
    category: "domestic",
    badge: "Most requested",
    description: "Fast, reliable domestic movement for urgent shipments that need clear visibility and predictable delivery windows.",
    summary: "Same-day coordination, route monitoring, and delivery confirmation for time-sensitive consignments.",
    features: ["Pickup scheduling", "Live route updates", "Delivery confirmation"],
    detail: "Ideal for manufacturers, retailers, and distributors moving high-priority inventory within Nigeria.",
  },
  {
    id: "international-freight",
    title: "International Freight",
    category: "international",
    badge: "Global",
    description: "End-to-end coordination for cross-border freight, export documentation, and customs-ready shipments.",
    summary: "Structured international logistics with transparent milestones from origin to destination.",
    features: ["Export documentation", "Customs support", "Milestone tracking"],
    detail: "Built for businesses shipping goods across West Africa, the Middle East, Europe, and beyond.",
  },
  {
    id: "warehousing",
    title: "Fulfilment & Warehousing",
    category: "commercial",
    badge: "Operations",
    description: "Secure storage, inventory handling, and dispatch coordination for growing commercial operations.",
    summary: "Flexible warehousing support that keeps stock organized and ready for distribution.",
    features: ["Inbound receiving", "Storage allocation", "Dispatch planning"],
    detail: "A practical solution for retailers, wholesalers, and brands that need dependable stock movement.",
  },
  {
    id: "last-mile-delivery",
    title: "Last-Mile Delivery",
    category: "support",
    badge: "Customer care",
    description: "Professional delivery management for final-mile handover, customer communication, and proof-of-delivery.",
    summary: "Clear updates, confirmation workflows, and a consistent handoff experience for customers.",
    features: ["Customer updates", "Proof of delivery", "Exception handling"],
    detail: "Designed for businesses that require a polished delivery experience and stronger post-shipment visibility.",
  },
  {
    id: "secure-document",
    title: "Secure Document Forwarding",
    category: "support",
    badge: "Compliance",
    description: "Confidential document transfers with controlled handling, traceability, and time-sensitive delivery.",
    summary: "A dependable option for legal, financial, and regulated paperwork that must move safely and quickly.",
    features: ["Signed handling", "Tracking visibility", "Priority movement"],
    detail: "Useful for contract packages, compliance paperwork, and business correspondence requiring assurance.",
  },
]

const categories = [
  { label: "All services", value: "all" },
  { label: "Domestic", value: "domestic" },
  { label: "International", value: "international" },
  { label: "Commercial", value: "commercial" },
  { label: "Support", value: "support" },
]

const quickStats = [
  { icon: Truck, label: "On-time visibility", value: "98.4%" },
  { icon: Globe2, label: "Connected lanes", value: "24+" },
  { icon: ShieldCheck, label: "Active support", value: "24/7" },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <section className="rounded-3xl border bg-primary px-6 py-10 text-primary-foreground shadow-sm md:px-10 md:py-14">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Professional logistics services</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            Freight solutions designed for reliable operations.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-primary-foreground/80 md:text-lg">
            Organize domestic transfers, international freight, and support services through a single modern platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:bg-accent/90"
            >
              Book a shipment
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-transparent px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/5"
            >
              Track a shipment
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {quickStats.map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-xl font-semibold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Service catalog</p>
              <h2 className="text-2xl font-semibold tracking-tight">Choose a solution</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedCategory(value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedCategory === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <Card key={service.id} className="h-full">
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {service.badge}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{service.category}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                  </div>

                  <p className="text-sm text-foreground/80">{service.summary}</p>

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-muted-foreground">{service.detail}</p>
                  </div>

                  <Link
                    href={`/product/${service.id}`}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View service details
                    <ArrowRight className="size-4" />
                  </Link>
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
