"use client"

import { FormEvent, Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/consign/site-header"
import { SiteFooter } from "@/components/consign/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePlatform } from "@/lib/platform-context"
import { DEMO_CUSTOMER_PASSWORD } from "@/lib/mock-data"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading sign in…</div>}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") === "admin" ? "admin" : "customer"
  const { loginCustomer, loginAdmin } = usePlatform()

  const [email, setEmail] = useState("adaeze.okonkwo@harborline.ng")
  const [password, setPassword] = useState(DEMO_CUSTOMER_PASSWORD)
  const [adminUser, setAdminUser] = useState("admin")
  const [adminPass, setAdminPass] = useState("admin")
  const [error, setError] = useState("")

  const defaultTab = useMemo(() => role, [role])

  const onCustomer = (event: FormEvent) => {
    event.preventDefault()
    const result = loginCustomer(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.push("/dashboard")
  }

  const onAdmin = (event: FormEvent) => {
    event.preventDefault()
    const result = loginAdmin(adminUser, adminPass)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.push("/operations")
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Access your customer account or the operations console with one secure entry point.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} onValueChange={() => setError("")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="admin">Operations</TabsTrigger>
              </TabsList>
              <TabsContent value="customer" className="mt-4">
                <form onSubmit={onCustomer} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Demo: adaeze.okonkwo@harborline.ng / {DEMO_CUSTOMER_PASSWORD}
                  </p>
                </form>
              </TabsContent>
              <TabsContent value="admin" className="mt-4">
                <form onSubmit={onAdmin} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-user">Username</Label>
                    <Input id="admin-user" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-pass">Password</Label>
                    <Input id="admin-pass" type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} required />
                  </div>
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  <Button type="submit" className="w-full">
                    Open console
                  </Button>
                  <p className="text-xs text-muted-foreground">Demo: admin / admin</p>
                </form>
              </TabsContent>
            </Tabs>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              New shipper?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
