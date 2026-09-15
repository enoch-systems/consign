"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TrackIndexPage() {
  const router = useRouter()
  const [tracking, setTracking] = useState("")

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const value = tracking.trim().toUpperCase()
    if (!value) return
    router.push(`/track/${value}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Track a shipment</CardTitle>
            <CardDescription>No account required. Enter the tracking number from your booking confirmation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. LGX8429137"
              />
              <Button type="submit">Track</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
