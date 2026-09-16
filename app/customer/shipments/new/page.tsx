"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PackageType, ShippingMethod } from "@/lib/types";
import { formatCurrency } from "@/components/shared/status-badge";
import { ArrowLeft, ArrowRight, Package, User, Truck, Scale, Ruler, Info, CheckCircle2, Send, Sparkles, Clock } from "lucide-react";

const PACKAGE_TYPES: PackageType[] = ["Box", "Envelope", "Pallet", "Crate", "Tube"];
const SHIPPING_METHODS: ShippingMethod[] = ["Standard", "Express", "Premium", "International"];

const METHOD_RATES: Record<ShippingMethod, { perKg: number; base: number; days: string }> = {
  "Standard": { perKg: 900, base: 2500, days: "5-7 days" },
  "Express": { perKg: 1800, base: 4500, days: "2-3 days" },
  "Premium": { perKg: 2800, base: 6500, days: "1-2 days" },
  "International": { perKg: 6500, base: 15000, days: "7-14 days" },
};

export default function CreateShipmentPage() {
  const router = useRouter();
  const { session, currentCustomer, createShipment } = useAppState();
  const [tab, setTab] = useState("sender");
  const [pkg, setPkg] = useState("Box");
  const [method, setMethod] = useState<ShippingMethod>("Standard");
  const [qty, setQty] = useState(1);
  const [w, setW] = useState(2);
  const [l, setH] = useState(20);
  const [h, setLen] = useState(30);
  const [len] = [l, h];
  const [sender, setSender] = useState({
    name: currentCustomer?.fullName || "",
    phone: currentCustomer?.phone || "",
    email: currentCustomer?.email || "",
    address: currentCustomer?.address || "",
    city: currentCustomer?.city || "",
    state: currentCustomer?.state || "",
    country: currentCustomer?.country || "United States",
  });
  const [recipient, setRecipient] = useState({
    name: "", phone: "", email: "", address: "", city: "New York", state: "New York", country: "United States",
  });
  const [instructions, setInstructions] = useState("");

  const customer = currentCustomer;
  const dims = `${l} × ${h} × 30 cm`;

  const cost = useMemo(() => {
    const r = METHOD_RATES[method];
    const weight = Math.max(0.5, Number(w) || 0);
    const packages = Math.max(1, Number(qty) || 1);
    const international = sender.country !== recipient.country ? 1.4 : 1;
    const isDomesticIntl = method === "International";
    const total = Math.round((r.base + r.perKg * weight * packages) * (isDomesticIntl ? 1 : international));
    return { total, base: r.base, weight: weight, packages, method };
  }, [method, w, qty, sender.country, recipient.country]);

  const etaDays = useMemo(() => {
    const map: Record<ShippingMethod, [number, number]> = {
      "Standard": [5, 7], "Express": [2, 3], "Premium": [1, 2], "International": [7, 14],
    };
    return map[method];
  }, [method]);

  const etaDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + etaDays[1]);
    return d.toISOString();
  }, [etaDays]);

  const validate = () => {
    if (!sender.name || !sender.phone || !sender.address || !sender.city || !sender.state || !sender.country) {
      toast.error("Please complete sender information."); setTab("sender"); return false;
    }
    if (!recipient.name || !recipient.phone || !recipient.address || !recipient.city || !recipient.state || !recipient.country) {
      toast.error("Please complete recipient information."); setTab("recipient"); return false;
    }
    if (!w || Number(w) <= 0) { toast.error("Enter a valid package weight."); setTab("package"); return false; }
    return true;
  };

  const submit = () => {
    if (!validate()) return;
    if (!session?.userId) { toast.error("Please sign in."); return; }
    const s = createShipment({
      customerId: session.userId,
      sender: { ...sender },
      recipient: { ...recipient },
      origin: `${sender.city}, ${sender.country}`,
      destination: `${recipient.city}, ${recipient.country}`,
      packageType: pkg as PackageType,
      weight: Number(w),
      dimensions: dims,
      packageCount: Number(qty),
      shippingMethod: method,
      cost: cost.total,
      currency: "USD",
      estimatedDelivery: etaDate,
      instructions: instructions.trim() || undefined,
    });
    if (s) {
      toast.success(`Shipment ${s.trackingNumber} created!`, {
        description: "The shipment is now visible in your dashboard and admin panel.",
        action: { label: "Open", onClick: () => router.push(`/customer/shipments/${s.id}`) },
      });
      setTimeout(() => router.push(`/customer/shipments/${s.id}`), 500);
    }
  };

  const fields = <T extends object>(v: T, set: (v: T) => void) => (k: keyof T) =>
    (e: React.ChangeEvent<HTMLInputElement>) => set({ ...v, [k]: e.target.value });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-5">
        <Button asChild variant="ghost" className="mb-4 h-9 rounded-full px-3 text-sm text-muted-foreground hover:text-foreground">
          <Link href="/customer/shipments" className="inline-flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em]">
          <span className="text-muted-foreground">Account</span>
          <span className="text-muted-foreground/70">/</span>
          <span className="text-primary">Shipments</span>
          <span className="text-muted-foreground/70">/</span>
          <span className="text-primary">Create</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl tracking-tight">Create a New Shipment</h1>
            <p className="text-muted-foreground mt-1">Fill in sender, recipient, and package details. We&apos;ll show a summary before you confirm.</p>
          </div>
          <Button asChild variant="outline" className="rounded-full"><Link href="/customer/shipments"><ArrowLeft className="w-4 h-4 mr-2" />Back to Shipments</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="boty-shadow border">
            <CardHeader className="pb-2">
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="font-serif text-xl flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />Shipment Details</CardTitle>
                  <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                    <TabsTrigger value="sender" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">1. Sender</TabsTrigger>
                    <TabsTrigger value="recipient" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">2. Recipient</TabsTrigger>
                    <TabsTrigger value="package" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">3. Package</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription className="mt-3">
                  {tab === "sender" && "Where is the package coming from? Pre-filled with your profile."}
                  {tab === "recipient" && "Who will receive the package?"}
                  {tab === "package" && "Package dimensions, weight and delivery speed."}
                </CardDescription>
              </Tabs>
            </CardHeader>

            <Tabs defaultValue="sender" value={tab} onValueChange={setTab}>
              <TabsContent value="sender">
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" value={sender.name} onChange={fields(sender, setSender)("name")} icon={<User className="w-4 h-4" />} placeholder="Sender name" />
                    <Field label="Phone" value={sender.phone} onChange={fields(sender, setSender)("phone")} icon={<Send className="w-4 h-4" />} placeholder="+234 801 234 5678" />
                  </div>
                  <Field label="Email" value={sender.email} onChange={fields(sender, setSender)("email")} type="email" placeholder="sender@example.com" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Country" value={sender.country} onChange={fields(sender, setSender)("country")} placeholder="United States" />
                    <Field label="State" value={sender.state} onChange={fields(sender, setSender)("state")} placeholder="New York" />
                    <Field label="City" value={sender.city} onChange={fields(sender, setSender)("city")} placeholder="New York City" />
                  </div>
                  <Field label="Street Address" value={sender.address} onChange={fields(sender, setSender)("address")} placeholder="12 Awolowo Road, Ikoyi" />
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={() => setTab("recipient")} className="rounded-full">Next: Recipient <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </CardFooter>
              </TabsContent>

              <TabsContent value="recipient">
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" value={recipient.name} onChange={fields(recipient, setRecipient)("name")} icon={<User className="w-4 h-4" />} placeholder="Recipient name" />
                    <Field label="Phone" value={recipient.phone} onChange={fields(recipient, setRecipient)("phone")} icon={<Send className="w-4 h-4" />} placeholder="+234 801 234 5678" />
                  </div>
                  <Field label="Email" value={recipient.email} onChange={fields(recipient, setRecipient)("email")} type="email" placeholder="recipient@example.com" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Country" value={recipient.country} onChange={fields(recipient, setRecipient)("country")} placeholder="United States" />
                    <Field label="State" value={recipient.state} onChange={fields(recipient, setRecipient)("state")} placeholder="FCT" />
                    <Field label="City" value={recipient.city} onChange={fields(recipient, setRecipient)("city")} placeholder="Chicago" />
                  </div>
                  <Field label="Street Address" value={recipient.address} onChange={fields(recipient, setRecipient)("address")} placeholder="21 Adetokunbo Ademola Crescent, Wuse II" />
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setTab("sender")} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
                  <Button onClick={() => setTab("package")} className="rounded-full">Next: Package <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </CardFooter>
              </TabsContent>

              <TabsContent value="package">
                <CardContent className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Package Type</Label>
                      <Select value={pkg} onValueChange={(v) => setPkg(v as PackageType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PACKAGE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Shipping Method</Label>
                      <Select value={method} onValueChange={(v) => setMethod(v as ShippingMethod)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SHIPPING_METHODS.map((m) => (
                            <SelectItem key={m} value={m}>
                              <span className="flex items-center justify-between gap-3 w-full pr-2">
                                <span>{m}</span>
                                <span className="text-xs text-muted-foreground font-normal">{METHOD_RATES[m].days}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Weight (kg)" type="number" value={String(w)} onChange={(e) => setW(Number(e.target.value))} icon={<Scale className="w-4 h-4" />} min={0.1} step={0.1} />
                    <Field label="Length (cm)" type="number" value={String(l)} onChange={(e) => setH(Number(e.target.value))} icon={<Ruler className="w-4 h-4" />} min={1} />
                    <Field label="Width (cm)" type="number" value={String(h)} onChange={(e) => setLen(Number(e.target.value))} icon={<Ruler className="w-4 h-4" />} min={1} />
                    <Field label="Number of Packages" type="number" value={String(qty)} onChange={(e) => setQty(Number(e.target.value))} icon={<Package className="w-4 h-4" />} min={1} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Additional Instructions (optional)</Label>
                    <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Leave at gate, signature required, fragile, etc." />
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setTab("recipient")} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
                  <Button onClick={submit} className="rounded-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary hover:to-cyan-500/90 text-white shadow-lg shadow-primary/20">
                    <CheckCircle2 className="w-4 h-4 mr-2" />Confirm & Create Shipment
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-4 h-fit">
          <Card className="boty-shadow border">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2"><Info className="w-4 h-4 text-primary" />Shipment Summary</CardTitle>
              <CardDescription>Live preview of cost and delivery timeline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-cyan-500/10 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><Truck className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-semibold">{method}</p>
                    <p className="text-xs text-muted-foreground">{METHOD_RATES[method].days} delivery</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-medium truncate">{sender.city || "—"}, {sender.country || "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-medium truncate">{recipient.city || "—"}, {recipient.country || "—"}</p>
                  </div>
                </div>
              </div>

              <dl className="space-y-2 text-sm">
                <Row label="Package Type" value={pkg} />
                <Row label="Weight" value={`${w} kg × ${qty} pkg${qty > 1 ? "s" : ""}`} />
                <Row label="Dimensions" value={dims} />
                <Row label="Route" value={sender.country !== recipient.country ? "International" : "Domestic"} />
              </dl>

              <div className="border-t pt-4">
                <dl className="space-y-1.5 text-sm">
                  <Row label="Base Fee" value={formatCurrency(cost.base, "USD")} />
                  <Row label={`Weight & Qty (${w}kg × ${qty})`} value={formatCurrency(cost.total - cost.base, "USD")} />
                </dl>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{etaDays[0]}–{etaDays[1]} business days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                    <p className="font-serif text-3xl text-primary font-semibold">{formatCurrency(cost.total, "USD")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {customer && (
            <Card className="boty-shadow border">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary font-serif text-xl flex items-center justify-center">{customer.fullName[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{customer.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, icon, placeholder, type, min, step }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon?: React.ReactNode; placeholder?: string; type?: string; min?: number; step?: number }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide">{label}</Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <Input type={type || "text"} value={value} onChange={onChange} placeholder={placeholder} min={min} step={step} className={icon ? "pl-10" : ""} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
