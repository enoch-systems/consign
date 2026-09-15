"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { StatusBadge } from "@/components/consign/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePlatform } from "@/lib/platform-context"
import { formatDate, formatDateTime, formatNgn } from "@/lib/format"

export default function TrackDetailPage() {
  const params = useParams<{ trackingNumber: string }>()
  const trackingNumber = decodeURIComponent(params.trackingNumber ?? "").toUpperCase()
  const { shipments, hydrated } = usePlatform()

  const shipment = useMemo(
    () => shipments.find((item) => item.trackingNumber.toUpperCase() === trackingNumber),
    [shipments, trackingNumber],
  )

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        {!hydrated ? (
          <p className="text-sm text-muted-foreground">Loading tracking…</p>
        ) : !shipment ? (
          <Card>
            <CardHeader>
              <CardTitle>No movement found</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {trackingNumber} was not found in the Consign network. Please verify the tracking number and try again.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Tracking</p>
              <h1 className="mt-1 font-mono text-2xl font-semibold">{shipment.trackingNumber}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusBadge status={shipment.status} />
                <span className="text-sm text-muted-foreground">{shipment.origin} → {shipment.destination}</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-sm">
                  <p className="text-muted-foreground">Current location</p>
                  <p className="mt-1 font-medium">{shipment.currentLocation}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-sm">
                  <p className="text-muted-foreground">ETA</p>
                  <p className="mt-1 font-medium">{formatDate(shipment.estimatedDelivery)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-sm">
                  <p className="text-muted-foreground">Service</p>
                  <p className="mt-1 font-medium">{shipment.shippingMethod} · {formatNgn(shipment.costNgn)}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {[...shipment.timeline].reverse().map((event) => (
                    <li key={event.id} className="border-l-2 border-primary/30 pl-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={event.status} />
                        <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium">{event.location}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
