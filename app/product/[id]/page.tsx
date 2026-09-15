"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, CheckCircle2, Clock3, MapPinned, ShieldCheck, Truck } from "lucide-react"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"

const services = [
  {
    id: "priority-express",
    title: "Priority Express",
    category: "Domestic shipping",
    badge: "Most requested",
    description:
      "A fast and dependable solution for urgent consignments that need close visibility, tighter scheduling, and confident last-mile delivery.",
    coverage: "Nigeria-wide",
    turnaround: "24–48 hours",
    audience: "Retail, health, and manufacturing teams",
    includes: [
      "Pickup scheduling and route confirmation",
      "Real-time milestone tracking",
      "Signed proof of delivery",
      "Priority escalation support",
    ],
    summary: "Designed for time-sensitive shipments that require dependable delivery windows and transparent updates.",
  },
  {
    id: "international-freight",
    title: "International Freight",
    category: "Global logistics",
    badge: "Global",
    description:
      "Structured cross-border movement for businesses shipping goods internationally, with operational oversight from origin to destination.",
    coverage: "West Africa, Middle East, Europe, and beyond",
    turnaround: "Custom lane plan",
    audience: "Exporters, importers, and trade teams",
    includes: [
      "Export and import documentation support",
      "Port and customs coordination",
      "Milestone progress updates",
      "Dedicated operations support",
    ],
    summary: "A coordinated international shipping program with clear milestones and proactive communication.",
  },
  {
    id: "warehousing",
    title: "Fulfilment & Warehousing",
    category: "Commercial support",
    badge: "Operations",
    description:
      "Secure inventory handling, storage coordination, and dispatch planning for businesses scaling their operations.",
    coverage: "Multi-site and centralized storage",
    turnaround: "Flexible scheduling",
    audience: "Wholesalers, retailers, and inventory teams",
    includes: [
      "Inbound receiving and storage",
      "Inventory management coordination",
      "Dispatch planning and release",
      "Stock visibility reporting",
    ],
    summary: "A practical warehousing layer that helps teams keep inventory organized and ready for dispatch.",
  },
  {
    id: "last-mile-delivery",
    title: "Last-Mile Delivery",
    category: "Customer delivery",
    badge: "Customer care",
    description:
      "A polished final delivery experience with customer updates, exception handling, and delivery confirmation built in.",
    coverage: "Urban and regional delivery zones",
    turnaround: "Same day to 3 days",
    audience: "E-commerce, hospitality, and service businesses",
    includes: [
      "Customer communication templates",
      "Proof of delivery capture",
      "Exception handling workflows",
      "Delivery status visibility",
    ],
    summary: "Built for businesses that want a professional experience right through to final handoff and confirmation.",
  },
  {
    id: "secure-document",
    title: "Secure Document Forwarding",
    category: "Compliance support",
    badge: "Compliance",
    description:
      "A controlled, secure process for document movement that needs confidentiality, traceability, and careful handling.",
    coverage: "Prioritized national and regional movement",
    turnaround: "Urgent scheduling available",
    audience: "Legal, financial, and regulated organizations",
    includes: [
      "Controlled handling and chain of custody",
      "Traceable movement updates",
      "Priority routing for urgent requests",
      "Discreet delivery processes",
    ],
    summary: "A dependable option for confidential packages and regulated paperwork requiring careful movement.",
  },
]

const relatedServices = services.filter((service) => service.id !== "priority-express")

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const serviceId = params.id as string
  const service = services.find((item) => item.id === serviceId) ?? services[0]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          ← Back to services
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{service.badge}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{service.title}</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{service.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: MapPinned, label: service.coverage },
                { icon: Clock3, label: service.turnaround },
                { icon: Truck, label: service.category },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-foreground"
                >
                  <Icon className="size-4 text-primary" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="mt-2 font-medium">{service.coverage}</p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Typical turnaround</p>
                <p className="mt-2 font-medium">{service.turnaround}</p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Best for</p>
                <p className="mt-2 font-medium">{service.audience}</p>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Service details</h2>
            <p className="mt-3 text-sm text-muted-foreground">{service.summary}</p>

            <ul className="mt-5 space-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Book this service
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/track"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-transparent px-4 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Track a shipment
              </Link>
            </div>
          </aside>
        </div>

        <section className="mt-12 rounded-3xl border bg-secondary/40 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Why customers choose Consign</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-card p-4">
              <p className="text-sm text-muted-foreground">Operational clarity</p>
              <p className="mt-2 text-base font-medium">Clear updates at every major handoff.</p>
            </div>
            <div className="rounded-2xl bg-card p-4">
              <p className="text-sm text-muted-foreground">Reliable coordination</p>
              <p className="mt-2 text-base font-medium">Less friction across domestic and international lanes.</p>
            </div>
            <div className="rounded-2xl bg-card p-4">
              <p className="text-sm text-muted-foreground">Customer confidence</p>
              <p className="mt-2 text-base font-medium">Professional delivery experiences from start to finish.</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">More services</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedServices.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="rounded-2xl border bg-card p-5 transition hover:border-primary/40 hover:bg-secondary/40"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.badge}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  View details
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
