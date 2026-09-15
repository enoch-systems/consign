"use client"

import { FormEvent, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { RequireSession } from "@/components/consign/require-session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePlatform } from "@/lib/platform-context"
import { estimateCost } from "@/lib/mock-data"
import { formatNgn } from "@/lib/format"
import type { PackageType, ShippingMethod } from "@/lib/types"

const methods: ShippingMethod[] = ["Standard", "Express", "Priority", "Freight"]
const packages: PackageType[] = ["Document", "Parcel", "Crate", "Pallet"]

export default function BookPage() {
  return (
    <RequireSession kind="customer">
      <BookBody />
    </RequireSession>
  )
}

function BookBody() {
  const router = useRouter()
  const { currentCustomer, createShipment } = usePlatform()
  const [origin, setOrigin] = useState("Lagos, Nigeria")
  const [destination, setDestination] = useState("London, United Kingdom")
  const [destCountry, setDestCountry] = useState("United Kingdom")
  const [packageType, setPackageType] = useState<PackageType>("Parcel")
  const [method, setMethod] = useState<ShippingMethod>("Express")
  const [weightKg, setWeightKg] = useState("12")
  const [dimensions, setDimensions] = useState("40 x 30 x 25 cm")
  const [contents, setContents] = useState("Commercial samples")
  const [recipientName, setRecipientName] = useState("")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientLine1, setRecipientLine1] = useState("")
  const [recipientCity, setRecipientCity] = useState("London")

  const international = destCountry.trim().toLowerCase() !== "nigeria"
  const cost = useMemo(
    () => estimateCost(Number(weightKg) || 1, method, international),
    [weightKg, method, international],
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!currentCustomer) return
    const eta = new Date()
    eta.setDate(eta.getDate() + (international ? 8 : 4))
    const result = createShipment({
      origin,
      destination,
      sender: {
        name: currentCustomer.name,
        company: currentCustomer.company,
        phone: currentCustomer.phone,
        email: currentCustomer.email,
        line1: currentCustomer.location,
        city: currentCustomer.location.split(",")[0] ?? currentCustomer.location,
        country: "Nigeria",
        postalCode: "000000",
      },
      recipient: {
        name: recipientName,
        phone: recipientPhone,
        email: recipientEmail,
        line1: recipientLine1,
        city: recipientCity,
        country: destCountry,
        postalCode: "000000",
      },
      packageType,
      weightKg: Number(weightKg) || 1,
      dimensions,
      contents,
      shippingMethod: method,
      estimatedDelivery: eta.toISOString(),
      costNgn: cost,
    })
    if ("error" in result) {
      toast.error(result.error)
      return
    }
    toast.success(`${result.trackingNumber} booked`)
    router.push(`/track/${result.trackingNumber}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Book a shipment</CardTitle>
            <CardDescription>Quote updates as you change weight, service, and destination country.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Origin</Label>
                  <Input value={origin} onChange={(e) => setOrigin(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Destination</Label>
                  <Input value={destination} onChange={(e) => setDestination(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Destination country</Label>
                  <Input value={destCountry} onChange={(e) => setDestCountry(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Weight (kg)</Label>
                  <Input type="number" min="0.1" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Package type</Label>
                  <Select value={packageType} onValueChange={(v) => setPackageType(v as PackageType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Service</Label>
                  <Select value={method} onValueChange={(v) => setMethod(v as ShippingMethod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {methods.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Dimensions</Label>
                <Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Contents</Label>
                <Textarea value={contents} onChange={(e) => setContents(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Recipient name</Label>
                  <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Recipient phone</Label>
                  <Input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Recipient email</Label>
                  <Input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Recipient city</Label>
                  <Input value={recipientCity} onChange={(e) => setRecipientCity(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Recipient address</Label>
                <Input value={recipientLine1} onChange={(e) => setRecipientLine1(e.target.value)} required />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-secondary/60 px-4 py-3">
                <span className="text-sm text-muted-foreground">Estimated charge</span>
                <span className="text-lg font-semibold">{formatNgn(cost)}</span>
              </div>
              <Button type="submit">Confirm booking</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
