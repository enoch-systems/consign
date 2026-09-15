"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { RequireSession } from "@/components/consign/require-session"
import { StatusBadge } from "@/components/consign/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePlatform } from "@/lib/platform-context"
import { formatDateTime, formatNgn } from "@/lib/format"
import { ACTIVE_STATUSES, SHIPMENT_STATUSES } from "@/lib/status"
import type { ShipmentStatus } from "@/lib/types"

export default function OperationsPage() {
  return (
    <RequireSession kind="admin">
      <OperationsBody />
    </RequireSession>
  )
}

function OperationsBody() {
  const { shipments, customers, activity, updateShipmentStatus } = usePlatform()
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return shipments
    return shipments.filter(
      (s) =>
        s.trackingNumber.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q),
    )
  }, [query, shipments])

  const inMotion = shipments.filter((s) => ACTIVE_STATUSES.includes(s.status)).length
  const exceptions = shipments.filter((s) => s.status === "Exception").length

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div>
          <p className="text-sm text-muted-foreground">Operations console</p>
          <h1 className="text-2xl font-semibold tracking-tight">Network control center</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Shipments</p>
              <p className="mt-1 text-2xl font-semibold">{shipments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In motion</p>
              <p className="mt-1 text-2xl font-semibold">{inMotion}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Exceptions</p>
              <p className="mt-1 text-2xl font-semibold">{exceptions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Accounts</p>
              <p className="mt-1 text-2xl font-semibold">{customers.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="shipments">
          <TabsList>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="shipments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipment board</CardTitle>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by tracking number or city"
                  className="mt-2 h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 text-sm"
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Lane</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update</TableHead>
                      <TableHead className="text-right">Charge</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((shipment) => (
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
                        <TableCell>
                          <Select
                            value={shipment.status}
                            onValueChange={(value) => updateShipmentStatus(shipment.id, value as ShipmentStatus)}
                          >
                            <SelectTrigger className="w-[190px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SHIPMENT_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">{formatNgn(shipment.costNgn)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customers" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.company ?? "—"}</TableCell>
                        <TableCell>{customer.location}</TableCell>
                        <TableCell>{customer.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardContent className="space-y-3 pt-6">
                {activity.slice(0, 20).map((event) => (
                  <div key={event.id} className="border-b pb-3 text-sm last:border-0">
                    <p className="font-medium">{event.action}</p>
                    <p className="text-muted-foreground">
                      {event.actor} · {formatDateTime(event.timestamp)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  )
}
