"use client"

import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { RequireSession } from "@/components/consign/require-session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePlatform } from "@/lib/platform-context"

export default function ProfilePage() {
  return (
    <RequireSession kind="customer">
      <ProfileBody />
    </RequireSession>
  )
}

function ProfileBody() {
  const { currentCustomer, updateProfile } = usePlatform()
  const [name, setName] = useState(currentCustomer?.name ?? "")
  const [phone, setPhone] = useState(currentCustomer?.phone ?? "")
  const [location, setLocation] = useState(currentCustomer?.location ?? "")
  const [company, setCompany] = useState(currentCustomer?.company ?? "")

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateProfile({ name, phone, location, company })
    toast.success("Profile updated")
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <p className="text-sm text-muted-foreground">{currentCustomer?.email}</p>
              <Button type="submit">Save</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
