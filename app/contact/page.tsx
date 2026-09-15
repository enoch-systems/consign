"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Headphones } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { openLiveChat, LiveChatWidget } from "@/components/shared/live-chat"

const contactChannels = [
  {
    name: "Phone",
    icon: Phone,
    primary: "+1 (800) 555-0147",
    secondary: "Mon – Sun · 24/7",
    href: "tel:+18005550147",
  },
  {
    name: "Email",
    icon: Mail,
    primary: "support@logix.com",
    secondary: "Reply within 2 hours",
    href: "mailto:support@logix.com",
  },
  {
    name: "Live Chat",
    icon: MessageCircle,
    primary: "Available online",
    secondary: "Instant messaging",
    href: "/contact",
  },
  {
    name: "Head Office",
    icon: MapPin,
    primary: "New York · United States",
    secondary: "100 Market Street",
    href: "#",
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const onChange = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      toast.success('Message sent! Our team will get back to you shortly.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 800)
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.3em] uppercase text-primary font-semibold mb-4 block">
              Get In Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question, need a quote, or want to open a corporate account? Our team is available around the clock to assist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16">
            {contactChannels.map((ch) => {
              const content = (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <ch.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{ch.name}</h3>
                  <p className="font-serif text-lg font-semibold text-foreground mb-1">{ch.primary}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> {ch.secondary}</p>
                </>
              )

              if (ch.name === "Live Chat") {
                return (
                  <button
                    key={ch.name}
                    type="button"
                    onClick={openLiveChat}
                    className="bg-card rounded-2xl border border-border p-6 logix-shadow boty-transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 text-left"
                  >
                    {content}
                  </button>
                )
              }

              return (
                <a
                  key={ch.name}
                  href={ch.href}
                  className="bg-card rounded-2xl border border-border p-6 logix-shadow boty-transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                >
                  {content}
                </a>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-5 gap-8 md:gap-12 bg-card rounded-3xl border border-border logix-shadow overflow-hidden">
            <div className="lg:col-span-2 bg-linear-to-br from-primary to-accent p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-6">
                  <Headphones className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Let's talk logistics</h2>
                <p className="text-white/80 leading-relaxed mb-8 max-w-md">
                  Send us a message and a member of our team will be in touch within 2 business hours. For urgent matters, call us anytime.
                </p>
                <ul className="space-y-5">
                  {[
                    { label: "Support", val: "+1 (800) 555-0147", Icon: Phone },
                    { label: "Sales", val: "sales@logix.com", Icon: Mail },
                    { label: "Head Office", val: "100 Market Street, New York, NY 10001", Icon: MapPin },
                    { label: "Business Hours", val: "24 / 7 · 365 days", Icon: Clock },
                  ].map((r) => (
                    <li key={r.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <r.Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs text-white/70">{r.label}</p>
                        <p className="text-sm font-semibold">{r.val}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form onSubmit={submit} className="lg:col-span-3 p-8 md:p-10 space-y-5">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">Send us a message</h2>
              <p className="text-sm text-muted-foreground mb-6">We respond to every inquiry. Use the form below for fastest service.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full name</label>
                  <input required value={form.name} onChange={e => onChange('name', e.target.value)} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input required type="email" value={form.email} onChange={e => onChange('email', e.target.value)} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" placeholder="john@company.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input value={form.phone} onChange={e => onChange('phone', e.target.value)} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <select required value={form.subject} onChange={e => onChange('subject', e.target.value)} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                    <option value="">Select a topic…</option>
                    <option>General inquiry</option>
                    <option>Track a shipment</option>
                    <option>Quote / Pricing</option>
                    <option>Corporate / Bulk account</option>
                    <option>Claim or complaint</option>
                    <option>Partnership</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea required value={form.message} onChange={e => onChange('message', e.target.value)} rows={5} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none" placeholder="Tell us about your logistics needs…" />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium boty-transition hover:bg-primary/90 cursor-pointer shadow-md shadow-primary/20 disabled:opacity-60"
                >
                  {sending ? 'Sending…' : (<>Send Message <Send className="w-4 h-4" /></>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <LiveChatWidget />
      <Footer />
    </main>
  )
}
