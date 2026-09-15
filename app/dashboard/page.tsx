"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { RequireSession } from "@/components/consign/require-session"
import { StatusBadge } from "@/components/consign/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePlatform } from "@/lib/platform-context"
import { formatDate, formatNgn } from "@/lib/format"
import { ACTIVE_STATUSES } from "@/lib/status"

export default function DashboardPage() {
  return (
    <RequireSession kind="customer">
      <DashboardBody />
    </RequireSession>
  )
}

function DashboardBody() {
  const { currentCustomer, shipments, notifications, markNotificationRead, markAllNotificationsRead } = usePlatform()
  const mine = shipments.filter((s) => s.customerId === currentCustomer?.id)
  const active = mine.filter((s) => ACTIVE_STATUSES.includes(s.status))
  const unread = notifications.filter((n) => n.userId === currentCustomer?.id && !n.read)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl font-semibold tracking-tight">{currentCustomer?.name}</h1>
            <p className="text-sm text-muted-foreground">{currentCustomer?.company || currentCustomer?.location}</p>
          </div>
          <Button asChild>
            <Link href="/book">Book a shipment</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Shipments</p>
              <p className="mt-1 text-2xl font-semibold">{mine.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In motion</p>
              <p className="mt-1 text-2xl font-semibold">{active.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Unread alerts</p>
              <p className="mt-1 text-2xl font-semibold">{unread.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Consignment overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Lane</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mine.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <Link href={`/track/${shipment.trackingNumber}`} className="font-mono text-primary hover:underline">
                        {shipment.trackingNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {shipment.origin} → {shipment.destination}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                    <TableCell>{formatDate(shipment.estimatedDelivery)}</TableCell>
                    <TableCell className="text-right">{formatNgn(shipment.costNgn)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            {currentCustomer ? (
              <Button variant="ghost" size="sm" onClick={() => markAllNotificationsRead(currentCustomer.id)}>
                Mark all read
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications
              .filter((n) => n.userId === currentCustomer?.id)
              .slice(0, 8)
              .map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => markNotificationRead(note.id)}
                  className="block w-full rounded-md border px-3 py-2 text-left text-sm hover:bg-secondary/60"
                >
                  <span className="font-medium">{note.title}</span>
                  {!note.read ? <span className="ml-2 text-xs text-accent">New</span> : null}
                  <p className="text-muted-foreground">{note.message}</p>
                </button>
              ))}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
