"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/components/shared/status-badge";
import { toast } from "sonner";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Globe2,
  Building2,
  Hash,
  CreditCard,
  Package,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

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
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const savePw = () => {
    if (!pw || pw.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (pw !== pw2) {
      toast.error("Passwords do not match.");
      return;
    }
    toast.success("Password changed successfully.");
    setPw("");
    setPw2("");
  };

  if (!cust) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Card className="border border-border/60 bg-card/85 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)]">
          <CardContent className="pt-10 pb-8">
            <p className="text-sm text-muted-foreground">Please sign in.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4 h-9 rounded-full px-3 text-sm text-muted-foreground hover:text-foreground">
          <Link href="/customer/dashboard" className="inline-flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em]">
          <span className="text-muted-foreground">Account</span>
          <span className="text-muted-foreground/70">/</span>
          <span className="text-primary">Profile</span>
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">Profile</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.48fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden border border-border/60 bg-card/85 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)]">
            <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),transparent_25%),linear-gradient(135deg,#0f172a_0%,#111827_42%,#0f172a_100%)] px-5 pb-10 pt-6 text-white sm:px-6">
              <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl font-semibold shadow-[0_18px_40px_-16px_rgba(15,23,42,0.8)] backdrop-blur-sm">
                  {cust.fullName[0]}
                </div>

                <div className="min-w-0">
                  <p className="font-serif text-2xl leading-tight sm:text-3xl">{cust.fullName}</p>
                  <p className="mt-1 text-sm text-slate-200">{cust.email}</p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    {cust.accountStatus}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="-mt-6 pb-4">
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Shipments" value={String(stats.total)} icon={<Package className="h-4 w-4" />} />
                <Stat label="Delivered" value={String(stats.delivered)} icon={<CheckCircle2 className="h-4 w-4" />} />
                <Stat label="Total Spend" value={formatCurrency(totalSpend, "USD")} icon={<CreditCard className="h-4 w-4" />} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/85 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.45)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 font-serif text-xl">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </span>
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Customer ID" value={cust.id.toUpperCase()} mono />
              <InfoRow label="Registered" value={formatDate(cust.createdAt)} />
              <InfoRow label="Last Active" value={formatDate(cust.lastActive)} />
              <InfoRow label="Active Shipments" value={String(stats.active)} />
              <InfoRow label="Exceptions" value={String(stats.exception)} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-border/60 bg-card/85 shadow-[0_26px_60px_-34px_rgba(15,23,42,0.5)]">
            <CardHeader className="pb-5">
              <Tabs defaultValue="profile">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <UserCircle className="h-4 w-4" />
                    </span>
                    Settings
                  </CardTitle>

                  <TabsList className="w-full max-w-xs">
                    <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                  </TabsList>
                </div>

                <CardDescription className="mt-4 text-sm text-muted-foreground">
                  Keep your personal and delivery details current and secure.
                </CardDescription>
              </Tabs>
            </CardHeader>

            <Tabs defaultValue="profile">
              <TabsContent value="profile">
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full Name" icon={<UserCircle className="h-4 w-4" />}>
                      <Input value={form.fullName} onChange={set("fullName")} className="h-11" />
                    </Field>
                    <Field label="Email" icon={<Mail className="h-4 w-4" />}>
                      <Input type="email" value={form.email} onChange={set("email")} className="h-11" />
                    </Field>
                    <Field label="Phone" icon={<Phone className="h-4 w-4" />}>
                      <Input value={form.phone} onChange={set("phone")} className="h-11" />
                    </Field>
                    <Field label="Country" icon={<Globe2 className="h-4 w-4" />}>
                      <Input value={form.country} onChange={set("country")} className="h-11" />
                    </Field>
                    <Field label="State" icon={<Building2 className="h-4 w-4" />}>
                      <Input value={form.state} onChange={set("state")} className="h-11" />
                    </Field>
                    <Field label="City" icon={<MapPin className="h-4 w-4" />}>
                      <Input value={form.city} onChange={set("city")} className="h-11" />
                    </Field>
                  </div>

                  <Field label="Street Address" icon={<Hash className="h-4 w-4" />}>
                    <Input value={form.address} onChange={set("address")} className="h-11" />
                  </Field>
                </CardContent>

                <CardFooter className="flex flex-col-reverse gap-3 border-t border-border/60 px-6 py-5 pt-4 sm:flex-row sm:justify-end">
                  <Button variant="outline" className="rounded-full h-10 px-5" asChild>
                    <Link href="/customer/dashboard">Cancel</Link>
                  </Button>
                  <Button className="rounded-full h-10 px-5" onClick={save} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </CardFooter>
              </TabsContent>

              <TabsContent value="security">
                <CardContent className="space-y-5">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-sm font-medium">Security check</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use a strong password to protect your account and shipment activity.
                    </p>
                  </div>

                  <Field label="New Password">
                    <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min. 6 characters" autoComplete="new-password" className="h-11" />
                  </Field>

                  <Field label="Confirm Password">
                    <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Retype password" autoComplete="new-password" className="h-11" />
                  </Field>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Use letters, numbers, and symbols for stronger protection.
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col-reverse gap-3 border-t border-border/60 px-6 py-5 pt-4 sm:flex-row sm:justify-end">
                  <Button variant="outline" className="rounded-full h-10 px-5" asChild>
                    <Link href="/customer/dashboard">Cancel</Link>
                  </Button>
                  <Button className="rounded-full h-10 px-5" onClick={savePw}>
                    Update Password
                  </Button>
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
      <Label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </Label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <div className={icon ? "[&>input]:pl-10 [&>input]:h-11" : ""}>{children}</div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-center shadow-sm">
      <div className="mb-2 inline-flex text-primary">{icon}</div>
      <p className="font-serif text-lg leading-tight text-foreground sm:text-xl">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-sm">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={`max-w-[58%] truncate text-sm font-medium text-foreground ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}
