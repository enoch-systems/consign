"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, formatCurrency, formatDate } from "@/components/shared/status-badge";
import { toast } from "sonner";
import { UserCircle, Mail, Phone, MapPin, Globe2, Building2, Hash, Crown, CreditCard, Package, TrendingUp, Activity, CheckCircle2 } from "lucide-react";

export default function CustomerProfilePage() {
  const { currentCustomer, updateCustomerProfile, shipmentsByCustomer, shipmentStatsByCustomer, session } = useAppState();
  const cust = currentCustomer;
  const stats = shipmentStatsByCustomer(session?.userId || "");
  const shipments = shipmentsByCustomer(session?.userId || "");
  const totalSpend = shipments.reduce((a, s) => a + s.cost, 0);

  const [form, setForm] = useState({
    fullName: cust?.fullName || "",
    email: cust?.email || "",
    phone: cust?.phone || "",
    address: cust?.address || "",
    country: cust?.country || "",
    state: cust?.state || "",
    city: cust?.city || "",
  });
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const save = () => {
    setSaving(true);
    try {
      const ok = updateCustomerProfile(session?.userId || "", { ...form });
      if (ok) toast.success("Profile updated successfully.");
      else toast.error("Could not update profile.");
    } finally { setTimeout(() => setSaving(false), 500); }
  };

  const savePw = () => {
    if (!pw || pw.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (pw !== pw2) { toast.error("Passwords do not match."); return; }
    toast.success("Password changed successfully.");
    setPw(""); setPw2("");
  };

  if (!cust) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <Card className="boty-shadow border"><CardContent className="pt-10 pb-8"><p>Please sign in.</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account details, address, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="boty-shadow border overflow-hidden">
            <div className="bg-gradient-to-br from-primary via-primary/90 to-cyan-500 text-white px-6 pt-6 pb-12 relative overflow-hidden">
              <div className="absolute -top-16 -right-10 w-52 h-52 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center font-serif text-4xl border-2 border-white/30 shadow-xl">
                  {cust.fullName[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-2xl leading-tight">{cust.fullName}</p>
                  <p className="text-white/80 text-sm">{cust.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs">
                    <CheckCircle2 className="w-3 h-3" />{cust.accountStatus}
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="mt-2 -translate-y-6">
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Shipments" value={String(stats.total)} icon={<Package className="w-4 h-4" />} />
                <Stat label="Delivered" value={String(stats.delivered)} icon={<CheckCircle2 className="w-4 h-4" />} />
                <Stat label="Spent" value={formatCurrency(totalSpend, "USD")} icon={<CreditCard className="w-4 h-4" />} />
              </div>
            </CardContent>
          </Card>

          <Card className="boty-shadow border">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Info label="Customer ID" value={cust.id.toUpperCase()} mono />
              <Info label="Registered" value={formatDate(cust.createdAt)} />
              <Info label="Last Active" value={formatDate(cust.lastActive)} />
              <Info label="Active Shipments" value={String(stats.active)} />
              <Info label="Exceptions" value={String(stats.exception)} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="boty-shadow border">
            <CardHeader>
              <Tabs defaultValue="profile">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="font-serif text-xl flex items-center gap-2"><UserCircle className="w-5 h-5 text-primary" />Account Settings</CardTitle>
                  <TabsList>
                    <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Profile</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Security</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription className="mt-3">
                  Update your shipping details, contact info and account password.
                </CardDescription>
              </Tabs>
            </CardHeader>
            <Tabs defaultValue="profile">
              <TabsContent value="profile">
                <CardContent className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" icon={<UserCircle className="w-4 h-4" />}><Input value={form.fullName} onChange={set("fullName")} /></Field>
                    <Field label="Email" icon={<Mail className="w-4 h-4" />}><Input type="email" value={form.email} onChange={set("email")} /></Field>
                    <Field label="Phone" icon={<Phone className="w-4 h-4" />}><Input value={form.phone} onChange={set("phone")} /></Field>
                    <Field label="Country" icon={<Globe2 className="w-4 h-4" />}><Input value={form.country} onChange={set("country")} /></Field>
                    <Field label="State" icon={<Building2 className="w-4 h-4" />}><Input value={form.state} onChange={set("state")} /></Field>
                    <Field label="City" icon={<Hash className="w-4 h-4" />}><Input value={form.city} onChange={set("city")} /></Field>
                  </div>
                  <Field label="Street Address" icon={<MapPin className="w-4 h-4" />}><Input value={form.address} onChange={set("address")} /></Field>
                </CardContent>
                <CardFooter className="justify-end gap-2 pt-4">
                  <Button variant="outline" className="rounded-full" asChild><Link href="/customer/dashboard">Cancel</Link></Button>
                  <Button className="rounded-full" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
                </CardFooter>
              </TabsContent>
              <TabsContent value="security">
                <CardContent className="space-y-5">
                  <Field label="New Password"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min. 6 characters" autoComplete="new-password" /></Field>
                  <Field label="Confirm Password"><Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Retype password" autoComplete="new-password" /></Field>
                  <p className="text-xs text-muted-foreground">Use a strong password with letters, numbers and symbols.</p>
                </CardContent>
                <CardFooter className="justify-end gap-2 pt-4">
                  <Button variant="outline" className="rounded-full" asChild><Link href="/customer/dashboard">Cancel</Link></Button>
                  <Button className="rounded-full" onClick={savePw}>Update Password</Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide flex items-center gap-2">{icon}{label}</Label>
      <div className="relative [&_input]:pl-10">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{icon}</div>}
        {children}
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-muted/20 dark:bg-muted/20 p-3 text-center">
      <div className="inline-flex text-primary mb-1">{icon}</div>
      <p className="font-serif text-xl leading-tight truncate">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 dark:bg-muted/20 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
