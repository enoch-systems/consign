"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2, Truck, Globe2, Bell, Shield, Settings as SettingsIcon,
  Phone, Mail, MapPin, Check, Plus, Trash2, Save,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/shared/admin/admin-page-header";

const SAVE = () => toast.success("Settings saved.", { description: "Changes will take effect immediately in this prototype." });

export default function AdminSettingsPage() {
  const [company, setCompany] = useState({
    name: "Logix Logistics",
    tagline: "Delivering Reliability Every Step of the Way",
    phone: "+1 (800) 555-0147",
    email: "support@logix.com",
    address: "100 Market Street, New York, NY 10001",
    rcNumber: "",
    website: "https://logix.com",
  });
  const [shipping, setShipping] = useState({
    defaultCurrency: "USD",
    defaultMethod: "Standard",
    freeShipThreshold: "100",
    autoConfirm: true,
    sendPickupSms: true,
    sendDeliverySms: true,
    weightUnit: "kg",
    dimensionUnit: "cm",
  });
  const [zones, setZones] = useState([
    { id: "z1", name: "Northeast", rate: "12", minDays: 1, maxDays: 2 },
    { id: "z2", name: "Southeast", rate: "15", minDays: 2, maxDays: 3 },
    { id: "z3", name: "West Coast", rate: "18", minDays: 2, maxDays: 4 },
    { id: "z4", name: "International (North America)", rate: "35", minDays: 3, maxDays: 6 },
    { id: "z5", name: "International (Global)", rate: "60", minDays: 5, maxDays: 14 },
  ]);
  const addZone = () => setZones((z) => [...z, { id: "z" + (z.length + 1), name: "New Zone", rate: "0", minDays: 1, maxDays: 2 }]);
  const delZone = (id: string) => setZones((z) => z.filter((x) => x.id !== id));

  const [notif, setNotif] = useState({
    emailShipmentCreated: true,
    emailStatusChanged: true,
    emailDelivered: true,
    emailException: true,
    smsOnPickup: true,
    smsOnDelivery: true,
    pushEnabled: true,
    weeklyDigest: false,
    adminAlerts: true,
  });

  const [admin, setAdmin] = useState({
    username: "admin",
    email: "admin@logix.com",
    phone: "+1 (555) 123-4567",
    twoFa: false,
    sessionTimeout: "30",
    timezone: "America/New_York",
  });

  const [system, setSystem] = useState({
    maintenance: false,
    debugMode: false,
    cacheTtl: "300",
    maxUploadMb: "50",
    dateFormat: "en-US",
    currencyFormat: "en-US",
  });

  return (
    <div className="max-w-6xl mx-auto pb-10 sm:pb-14">
      <AdminPageHeader
        title="System Settings"
        subtitle="Configure platform settings. These are mock settings for the prototype."
      />

      <Tabs defaultValue="company">
        <div className="mb-6 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <TabsList className="inline-flex w-max min-w-full sm:min-w-0 rounded-2xl bg-muted/40 p-1.5 space-x-1">
            <TabsTrigger value="company" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Building2 className="w-4 h-4 mr-2 shrink-0" />Company</TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Truck className="w-4 h-4 mr-2 shrink-0" />Shipping</TabsTrigger>
            <TabsTrigger value="zones" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Globe2 className="w-4 h-4 mr-2 shrink-0" />Zones</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Bell className="w-4 h-4 mr-2 shrink-0" />Notifications</TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Shield className="w-4 h-4 mr-2 shrink-0" />Admin</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><SettingsIcon className="w-4 h-4 mr-2 shrink-0" />System</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="company">
          <Card className="rounded-2xl border shadow-sm overflow-hidden">
            <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" />Company Information</CardTitle>
              <CardDescription>Branding and contact details shown across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Company Name"><Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} /></Field>
                <Field label="Tagline"><Input value={company.tagline} onChange={(e) => setCompany({ ...company, tagline: e.target.value })} /></Field>
                <Field label="Phone" icon={<Phone className="w-4 h-4" />}><Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} /></Field>
                <Field label="Email" icon={<Mail className="w-4 h-4" />}><Input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} /></Field>
                <Field label="RC Number"><Input value={company.rcNumber} onChange={(e) => setCompany({ ...company, rcNumber: e.target.value })} /></Field>
                <Field label="Website"><Input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} /></Field>
              </div>
              <Field label="Office Address" icon={<MapPin className="w-4 h-4" />}><Input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} /></Field>
              <div className="pt-2 flex justify-end"><Button onClick={SAVE} className="rounded-xl shadow-md shadow-primary/15"><Save className="w-4 h-4 mr-2" />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="rounded-2xl border shadow-sm overflow-hidden">
            <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><Truck className="w-4 h-4 text-primary" />Shipping Settings</CardTitle>
              <CardDescription>Defaults and automation rules for shipments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Default Currency">
                  <Select value={shipping.defaultCurrency} onValueChange={(v) => setShipping({ ...shipping, defaultCurrency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($) — US Dollar</SelectItem>
                      <SelectItem value="GBP">GBP (£) — Pound</SelectItem>
                      <SelectItem value="EUR">EUR (€) — Euro</SelectItem>
                      <SelectItem value="GHS">GHS (GH₵) — Ghana Cedi</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Default Shipping Method">
                  <Select value={shipping.defaultMethod} onValueChange={(v) => setShipping({ ...shipping, defaultMethod: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard (5-7 days)</SelectItem>
                      <SelectItem value="Express">Express (2-3 days)</SelectItem>
                      <SelectItem value="Premium">Premium (1-2 days)</SelectItem>
                      <SelectItem value="International">International (7-14 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Free Shipping Threshold (USD)"><Input type="number" value={shipping.freeShipThreshold} onChange={(e) => setShipping({ ...shipping, freeShipThreshold: e.target.value })} /></Field>
                <Field label="Session Timeout (min)"><Input type="number" value={shipping.weightUnit} onChange={(e) => setShipping({ ...shipping, weightUnit: e.target.value })} /></Field>
                <Field label="Weight Unit">
                  <Select value={shipping.weightUnit} onValueChange={(v) => setShipping({ ...shipping, weightUnit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="kg">Kilograms (kg)</SelectItem><SelectItem value="lbs">Pounds (lbs)</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Dimension Unit">
                  <Select value={shipping.dimensionUnit} onValueChange={(v) => setShipping({ ...shipping, dimensionUnit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="cm">Centimeters (cm)</SelectItem><SelectItem value="in">Inches (in)</SelectItem></SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 border rounded-2xl p-4 bg-muted/20">
                <Toggle label="Auto-confirm Orders" checked={shipping.autoConfirm} setChecked={(v) => setShipping({ ...shipping, autoConfirm: v })} />
                <Toggle label="Pickup SMS" checked={shipping.sendPickupSms} setChecked={(v) => setShipping({ ...shipping, sendPickupSms: v })} />
                <Toggle label="Delivery SMS" checked={shipping.sendDeliverySms} setChecked={(v) => setShipping({ ...shipping, sendDeliverySms: v })} />
              </div>
              <div className="pt-2 flex justify-end"><Button onClick={SAVE} className="rounded-xl shadow-md shadow-primary/15"><Save className="w-4 h-4 mr-2" />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
          <Card className="rounded-2xl border shadow-sm overflow-hidden">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg flex items-center gap-2"><Globe2 className="w-4 h-4 text-primary" />Delivery Zones</CardTitle>
                <CardDescription>Shipping zones, base rates and delivery window defaults.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addZone} className="rounded-xl shadow-md shadow-primary/15"><Plus className="w-4 h-4 mr-2" />Add Zone</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.map((z, i) => (
                <div key={z.id} className="grid grid-cols-12 gap-3 items-end border rounded-2xl p-4 bg-card">
                  <div className="col-span-12 sm:col-span-4"><Label className="text-xs uppercase tracking-wide">Zone {i + 1} Name</Label><Input className="mt-1.5" value={z.name} onChange={(e) => setZones((list) => list.map((x) => x.id === z.id ? { ...x, name: e.target.value } : x))} /></div>
                  <div className="col-span-6 sm:col-span-2"><Label className="text-xs uppercase tracking-wide">Rate (USD)</Label><Input type="number" className="mt-1.5" value={z.rate} onChange={(e) => setZones((list) => list.map((x) => x.id === z.id ? { ...x, rate: e.target.value } : x))} /></div>
                  <div className="col-span-3 sm:col-span-1"><Label className="text-xs uppercase tracking-wide">Min Days</Label><Input type="number" className="mt-1.5" value={z.minDays} onChange={(e) => setZones((list) => list.map((x) => x.id === z.id ? { ...x, minDays: Number(e.target.value) } : x))} /></div>
                  <div className="col-span-3 sm:col-span-1"><Label className="text-xs uppercase tracking-wide">Max Days</Label><Input type="number" className="mt-1.5" value={z.maxDays} onChange={(e) => setZones((list) => list.map((x) => x.id === z.id ? { ...x, maxDays: Number(e.target.value) } : x))} /></div>
                  <div className="col-span-12 sm:col-span-4 flex justify-end sm:justify-end gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:border-rose-300 dark:hover:border-rose-500/40" onClick={() => delZone(z.id)}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 flex justify-end"><Button onClick={SAVE} className="rounded-xl shadow-md shadow-primary/15"><Save className="w-4 h-4 mr-2" />Save Zones</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="rounded-2xl border shadow-sm overflow-hidden">
            <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><Bell className="w-4 h-4 text-primary" />Notification Settings</CardTitle>
              <CardDescription>Email, SMS and push notifications for admin & customers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-4 border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-primary" />Email Notifications</h3>
                  <Toggle label="Shipment Created" checked={notif.emailShipmentCreated} setChecked={(v) => setNotif({ ...notif, emailShipmentCreated: v })} />
                  <Toggle label="Status Changed" checked={notif.emailStatusChanged} setChecked={(v) => setNotif({ ...notif, emailStatusChanged: v })} />
                  <Toggle label="Delivered" checked={notif.emailDelivered} setChecked={(v) => setNotif({ ...notif, emailDelivered: v })} />
                  <Toggle label="Exception Alert" checked={notif.emailException} setChecked={(v) => setNotif({ ...notif, emailException: v })} />
                </div>
                <div className="space-y-4 border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-primary" />SMS, Push & Reports</h3>
                  <Toggle label="Pickup SMS" checked={notif.smsOnPickup} setChecked={(v) => setNotif({ ...notif, smsOnPickup: v })} />
                  <Toggle label="Delivery SMS" checked={notif.smsOnDelivery} setChecked={(v) => setNotif({ ...notif, smsOnDelivery: v })} />
                  <Toggle label="Push Notifications" checked={notif.pushEnabled} setChecked={(v) => setNotif({ ...notif, pushEnabled: v })} />
                  <Toggle label="Weekly Digest" checked={notif.weeklyDigest} setChecked={(v) => setNotif({ ...notif, weeklyDigest: v })} />
                  <Toggle label="Admin Exceptions Alert" checked={notif.adminAlerts} setChecked={(v) => setNotif({ ...notif, adminAlerts: v })} />
                </div>
              </div>
              <div className="pt-6 flex justify-end"><Button onClick={SAVE} className="rounded-xl shadow-md shadow-primary/15"><Save className="w-4 h-4 mr-2" />Save Preferences</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="rounded-2xl border shadow-sm overflow-hidden">
            <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><Shield className="w-4 h-4 text-primary" />Admin Account</CardTitle>
              <CardDescription>Credentials, security and timezone for the administrator account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border bg-primary/[0.04] dark:bg-primary/10 border-primary/20 dark:border-primary/25 text-foreground p-4 text-sm flex items-start gap-3">
                <Shield className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                <div>
                  <p className="font-semibold text-[13px] mb-0.5">Admin Account Security</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Admin authentication is active. Use strong credentials, enable Two-Factor Authentication below, and configure a short session timeout. In production, always integrate a secure identity provider and never hardcode credentials in source code.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Username"><Input value={admin.username} onChange={(e) => setAdmin({ ...admin, username: e.target.value })} /></Field>
                <Field label="Email"><Input type="email" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} /></Field>
                <Field label="Phone"><Input value={admin.phone} onChange={(e) => setAdmin({ ...admin, phone: e.target.value })} /></Field>
                <Field label="Timezone">
                  <Select value={admin.timezone} onValueChange={(v) => setAdmin({ ...admin, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Chicago">America/Chicago (GMT-6)</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles (GMT-8)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Session Timeout (min)"><Input type="number" value={admin.sessionTimeout} onChange={(e) => setAdmin({ ...admin, sessionTimeout: e.target.value })} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 border rounded-2xl p-4 bg-muted/20">
                <Toggle label="Two-Factor Authentication (2FA)" checked={admin.twoFa} setChecked={(v) => setAdmin({ ...admin, twoFa: v })} />
              </div>
              <div className="pt-2 flex justify-end"><Button onClick={SAVE} className="rounded-xl shadow-md shadow-primary/15"><Save className="w-4 h-4 mr-2" />Save Admin Settings</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="rounded-2xl border shadow-sm overflow-hidden">
            <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><SettingsIcon className="w-4 h-4 text-primary" />System Settings</CardTitle>
              <CardDescription>Platform-wide behaviour and technical options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Cache TTL (seconds)"><Input type="number" value={system.cacheTtl} onChange={(e) => setSystem({ ...system, cacheTtl: e.target.value })} /></Field>
                <Field label="Max Upload Size (MB)"><Input type="number" value={system.maxUploadMb} onChange={(e) => setSystem({ ...system, maxUploadMb: e.target.value })} /></Field>
                <Field label="Date Locale">
                  <Select value={system.dateFormat} onValueChange={(v) => setSystem({ ...system, dateFormat: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="en-GB">English (UK)</SelectItem><SelectItem value="en-US">English (US)</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Currency Locale">
                  <Select value={system.currencyFormat} onValueChange={(v) => setSystem({ ...system, currencyFormat: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="en-US">US ($)</SelectItem><SelectItem value="en-GB">UK (£)</SelectItem></SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 border rounded-2xl p-4 bg-muted/20">
                <Toggle label="Maintenance Mode" checked={system.maintenance} setChecked={(v) => setSystem({ ...system, maintenance: v })} />
                <Toggle label="Debug Mode" checked={system.debugMode} setChecked={(v) => setSystem({ ...system, debugMode: v })} />
              </div>
              <div className="pt-2 flex justify-end"><Button onClick={SAVE} className="rounded-xl shadow-md shadow-primary/15"><Save className="w-4 h-4 mr-2" />Save System Settings</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide flex items-center gap-2">{icon}{label}</Label>
      <div className="relative [&_input]:pl-10 [&_input]:h-11 [&_input]:rounded-xl [&_select]:h-11 [&_[data-slot=select-trigger]]:h-11 [&_[data-slot=select-trigger]]:rounded-xl">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{icon}</div>}
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, checked, setChecked }: { label: string; checked: boolean; setChecked: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}
