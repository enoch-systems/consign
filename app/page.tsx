"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowRight, Search, LocateFixed, Package, Truck, Plane, PlaneTakeoff, Ship, MapPin, Clock, Shield,
  CheckCircle2, Globe, BarChart3, Users, Star, ChevronDown, ChevronRight,
  Zap, Award, Headphones, ArrowUpDown
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useAppState } from "@/lib/app-state"
import { formatCurrency } from "@/components/shared/status-badge"
import { LiveChatWidget } from "@/components/shared/live-chat"

function useOnVisible<T extends HTMLElement>(options = {}) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1, ...options },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Section({ id, eyebrow, title, subtitle, children, reverse = false, className = "" }: any) {
  const { ref, visible } = useOnVisible<HTMLDivElement>()
  return (
    <section id={id} className={`py-16 sm:py-20 sm:py-24 ${className}`}>
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {(eyebrow || title || subtitle) && (
          <div className={`text-center mb-12 md:mb-16 ${visible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={visible ? { animationFillMode: 'forwards' } : {}}>
            {eyebrow && <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-semibold mb-4 block">{eyebrow}</span>}
            {title && <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 text-balance leading-tight">{title}</h2>}
            {subtitle && <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className={reverse ? '' : ''}>{children}</div>
      </div>
    </section>
  )
}

const heroVideoUrls = [
  "https://res.cloudinary.com/qz5m8bhg/video/upload/v1789495881/From_Klickpin.com-_371335931789711588-pin-id-371335931789711588_ng2her.mp4",
  "https://res.cloudinary.com/qz5m8bhg/video/upload/v1789495877/From_Klickpin.com-_94927504641887252-pin-id-94927504641887252_f0cwhx.mp4",
]

function Hero() {
  const router = useRouter()
  const { findShipmentByTracking } = useAppState()
  const [tracking, setTracking] = useState('')
  const [error, setError] = useState('')
  const [videoIndex, setVideoIndex] = useState(0)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    const q = tracking.trim()
    if (!q) { setError('Enter a tracking number'); return }
    const match = findShipmentByTracking(q)
    if (match) { router.push(`/track/${match.trackingNumber}`) }
    else setError('No shipment found. Try LGX8429137 or US45678291')
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <video
          key={videoIndex}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setVideoIndex((current) => (current + 1) % heroVideoUrls.length)}
          className="absolute inset-0 h-full w-full object-cover opacity-70 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen grayscale brightness-110 dark:brightness-75 contrast-110 dark:contrast-125 saturate-0"
          style={{ filter: 'saturate(0.2) brightness(1.05) contrast(1.1) blur(0.4px)' }}
        >
          <source src={heroVideoUrls[videoIndex]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-background/35 via-background/55 to-background/70 dark:from-background/90 dark:via-background/75 dark:to-background/80" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px',
          color: 'currentColor',
        }} />
        <div className="absolute top-24 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-12 -right-20 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="w-full">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary animate-blur-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
                TRUSTED BY 25,000+ BUSINESSES
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground mt-6 text-balance animate-blur-in opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
                Ship smarter. <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Track faster.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-slate-800 dark:text-muted-foreground mt-6 max-w-xl animate-blur-in opacity-0" style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}>
                A trusted US logistics platform for domestic and international shipping. Real-time tracking, reliable delivery, transparent pricing.
              </p>

              {/* Tracking form */}
              <form onSubmit={handleTrack} id="track" className="mt-8 animate-blur-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                <label className="block text-sm font-semibold text-foreground mb-3">Track your shipment</label>
                <div className="flex flex-col sm:flex-row gap-3 p-2 sm:p-2 bg-card rounded-2xl border border-border logix-shadow">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:py-1 rounded-xl sm:rounded-lg">
                    <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                      value={tracking}
                      onChange={(e) => { setTracking(e.target.value); if (error) setError('') }}
                      type="text"
                      placeholder="Enter tracking number (e.g. LGX8429137)"
                      className="flex-1 w-full bg-transparent outline-none text-sm sm:text-base placeholder:text-muted-foreground/60 text-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm sm:text-base font-medium boty-transition hover:bg-primary/90 shadow-md shadow-primary/30 cursor-pointer whitespace-nowrap"
                  >
                    Track Shipment <LocateFixed className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
                <p className="mt-3 text-xs text-muted-foreground">Try: <span className="font-mono text-primary">LGX8429137</span> · <span className="font-mono text-primary">US45678291</span> · <span className="font-mono text-primary">LGS9201847</span></p>
              </form>

              <div className="flex flex-nowrap items-center gap-2 mt-10 animate-blur-in opacity-0 sm:gap-6" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                <Link
                  href="/customer/signup"
                    className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 px-3 py-3 rounded-full border border-border bg-card text-foreground font-medium boty-transition hover:bg-accent/10 cursor-pointer text-xs whitespace-nowrap sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-base"
                >
                  <PlaneTakeoff className="w-4 h-4" /> Start Shipping
                </Link>
                <Link
                  href="/#how-it-works"
                    className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 px-3 py-3 rounded-full border border-border/90 bg-transparent text-foreground font-medium boty-transition hover:bg-accent/10 cursor-pointer text-xs whitespace-nowrap sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-base"
                >
                  How it works <ChevronDown className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right side: featured shipment status card */}
            <div className="relative animate-blur-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-xl shadow-slate-950/10 sm:p-8">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">LGX · LIVE</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="truncate font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">US45678291</div>
                  </div>
                  <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-200 bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300">
                    <ArrowUpDown className="w-3 h-3" /> In Transit
                  </div>
                </div>

                <div className="relative mb-6 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:mb-8 sm:p-5">
                  <div className="mb-3 flex items-end justify-between gap-3 text-xs sm:text-sm">
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Origin</p>
                      <p className="truncate font-semibold text-foreground">New York, US</p>
                    </div>
                    <div className="min-w-0 text-right">
                      <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Destination</p>
                      <p className="truncate font-semibold text-foreground">New York, US</p>
                    </div>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className="absolute inset-y-0 left-0 w-[62%] rounded-full bg-gradient-to-r from-primary via-accent to-primary" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-[58%] w-5 h-5 rounded-full bg-primary border-4 border-card shadow-md shadow-primary/30 flex items-center justify-center">
                      <Plane className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="mt-3 text-center text-xs text-muted-foreground">Current stop: <span className="font-medium text-primary">Dubai, UAE</span></p>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0 rounded-2xl border border-border bg-background/80 p-3 sm:p-4">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Est. Delivery</p>
                    <p className="mt-1 truncate text-sm font-semibold text-foreground">In 3 days</p>
                  </div>
                  <div className="min-w-0 rounded-2xl border border-border bg-background/80 p-3 sm:p-4">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Current Location</p>
                    <p className="mt-1 truncate text-sm font-semibold text-foreground">Dubai, UAE</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs leading-5 text-muted-foreground">Shipped via <span className="font-medium text-foreground">International Air Freight</span></span>
                  <Link href="/track/US45678291" className="inline-flex items-center gap-1 self-start text-xs font-semibold text-primary hover:underline sm:self-auto">
                    View details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 rotate-[-6deg] bg-card border border-border rounded-2xl p-3 logix-shadow hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">100% Insured</p>
                  <p className="text-[10px] text-muted-foreground">Full cargo coverage</p>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-3 rotate-[5deg] bg-card border border-border rounded-2xl p-3 logix-shadow hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Avg 2.4 days</p>
                  <p className="text-[10px] text-muted-foreground">US delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsStrip() {
  const stats = [
    { label: 'Shipments Delivered', target: 1.2, suffix: 'M+', Icon: Package },
    { label: 'Cities Covered', target: 2400, suffix: '+', Icon: MapPin },
    { label: 'Happy Customers', target: 25000, suffix: '+', Icon: Users },
    { label: 'On-Time Rate', target: 98.6, suffix: '%', Icon: CheckCircle2 },
  ]
  return (
    <div className="relative -mt-12 z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-card rounded-3xl border border-border logix-shadow grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/60 overflow-hidden">
          {stats.map((stat, i) => <AnimatedStat key={stat.label} {...stat} index={i} />)}
        </div>
      </div>
    </div>
  )
}

function AnimatedStat({ label, target, suffix, Icon, index }: { label: string; target: number; suffix: string; Icon: typeof Package; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.35 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let frame = 0
    let start = 0
    let loop: number

    const runCounter = () => {
      window.cancelAnimationFrame(frame)
      start = 0
      setValue(0)
      const animate = (time: number) => {
        if (!start) start = time
        const progress = Math.min((time - start) / 1300, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(target * eased)
        if (progress < 1) frame = requestAnimationFrame(animate)
      }
      frame = requestAnimationFrame(animate)
    }

    const delay = window.setTimeout(() => {
      runCounter()
      loop = window.setInterval(runCounter, 10000)
    }, index * 140)

    return () => {
      window.clearTimeout(delay)
      window.clearInterval(loop)
      window.cancelAnimationFrame(frame)
    }
  }, [index, target, visible])

  const display = target < 100 ? value.toFixed(1) : Math.round(value).toLocaleString()
  const entrance = ['-translate-x-5', 'translate-y-5', 'translate-x-5', 'translate-y-5'][index]

  return (
    <div ref={ref} className={`p-5 text-center transition-all duration-700 sm:p-8 ${visible ? 'translate-x-0 translate-y-0 opacity-100' : `${entrance} opacity-0`}`}>
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="font-serif text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">{display}{suffix}</div>
      <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</div>
    </div>
  )
}

function Services() {
  const services = [
    { title: 'Domestic Delivery', desc: 'Fast door-to-door shipping across all 50 states within 1-3 business days.', image: 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1789537779/van_keybjj.png', tag: '01 · Last mile' },
    { title: 'International Shipping', desc: 'Worldwide delivery via air, sea and express partners. Customs cleared to 190+ countries.', image: 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1789536860/1_3_efyhqf.png', tag: '02 · Global network' },
    { title: 'Sea Freight', desc: 'Cost-effective bulk cargo and container shipping for commercial import / export.', image: 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1789536854/1_4_oeat8u.png', tag: '03 · Ocean lanes' },
    { title: 'Warehousing', desc: 'Secure storage, inventory management, and fulfilment services across our network hubs.', image: 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1789537776/warehouse_wnzrat.png', tag: '04 · Fulfilment' },
    { title: 'Express Courier', desc: 'Same-day and next-day urgent deliveries in major US metropolitan areas.', image: 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1789536854/1_2_kxe8pc.png', tag: '05 · Priority' },
    { title: 'Cargo Insurance', desc: 'Optional comprehensive insurance for loss, damage, theft with every shipment.', image: 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1789536865/1_1_xyjovj.png', tag: '06 · Protection' },
  ]
  return (
    <Section id="services" eyebrow="Our Services" title="Everything logistics, one platform" subtitle="From small envelopes to full containers, we handle every stage of your supply chain with reliability and visibility.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {services.map(({ title, desc, image, tag }, i) => (
          <article key={title} className={`group relative overflow-hidden rounded-[26px] border border-border/80 bg-card transition duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 ${i < 2 ? 'lg:col-span-6' : 'lg:col-span-4'}`}>
            <div className={`relative flex items-center justify-center overflow-hidden border-b border-border/70 bg-primary/[0.035] ${i < 2 ? 'h-44 sm:h-52' : 'h-36 sm:h-40'}`}>
              <div className="absolute left-5 top-4 z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/75">{tag}</div>
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-primary/10 transition duration-700 group-hover:scale-150" />
              <Image src={image} alt="" fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw" priority={i < 2} className="object-contain p-[14%] transition duration-700 ease-out group-hover:scale-110" />
            </div>
            <div className="flex min-h-[178px] flex-col p-5 sm:p-6">
              <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{desc}</p>
              <div className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Learn more <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Create a shipment', desc: 'Enter sender, recipient and package details on our simple form.', Icon: Package },
    { n: '02', title: 'We pick it up', desc: 'Our courier arrives at your door within scheduled pickup window.', Icon: Truck },
    { n: '03', title: 'Track in real-time', desc: 'Live location updates, status timelines, and SMS/email alerts.', Icon: Globe },
    { n: '04', title: 'Delivered', desc: 'Proof of delivery with signature capture, and delivery photos.', Icon: CheckCircle2 },
  ]
  return (
    <Section id="how-it-works" eyebrow="How It Works" title="4 steps from pickup to doorstep" subtitle="Our simplified workflow is designed so you focus on your business while we handle the logistics.">
      <div className="relative">
        <div className="hidden md:block absolute left-16 right-16 top-16 h-0.5 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 rounded-full" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {steps.map(({ n, title, desc, Icon }, i) => (
            <div key={title} className="relative text-center">
              <div className="relative z-10 mx-auto w-28 h-28 rounded-3xl bg-card border border-border logix-shadow flex items-center justify-center mb-5 group hover:-translate-y-1 boty-transition">
                <span className="absolute -top-2 -left-2 font-serif text-xs font-bold text-primary bg-primary/10 rounded-full px-2.5 py-1 border border-primary/20">{n}</span>
                <Icon className="w-12 h-12 text-primary" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Coverage() {
  const domestic = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Dallas', 'Seattle', 'Boston', 'Atlanta', 'Denver', 'Miami', 'San Francisco']
  const international = ['London', 'Dubai', 'Toronto', 'Mexico City', 'Frankfurt', 'Tokyo', 'Hong Kong', 'Singapore', 'Sydney', 'São Paulo']
  return (
    <Section id="coverage" eyebrow="Delivery Coverage" title="Reach everywhere that matters" subtitle="Domestic coverage across every state and Washington D.C. Global reach via our partner network of 190+ countries.">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {[
          { title: 'Domestic Shipping', sub: 'Nationwide, 1–3 business days', tags: domestic, accent: 'primary', Icon: Truck },
          { title: 'International Shipping', sub: 'Worldwide, 3–10 business days', tags: international, accent: 'accent', Icon: Globe },
        ].map(({ title, sub, tags, accent, Icon }) => (
          <div key={title} className="bg-card rounded-3xl border border-border p-6 sm:p-8 logix-shadow overflow-hidden relative">
            <div className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-${accent}/10 blur-3xl`} />
            <div className="relative flex items-start justify-between mb-5">
              <div>
                <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-${accent}/10 text-${accent} border border-${accent}/20`} style={accent === 'primary' ? { background: 'rgb(var(--primary)/0.1)', color: 'var(--primary)', borderColor: 'rgb(var(--primary)/0.2)' } : {}}>
                  <Icon className="w-3.5 h-3.5" /> {sub}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">{title}</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-background border border-border text-xs sm:text-sm font-medium text-foreground/80 hover:border-primary hover:text-primary boty-transition">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function WhyUs() {
  const rows = [
    { title: 'Real-time tracking on every shipment', desc: 'Never wonder where your package is. Live GPS tracking, scan events, and a visual timeline.', Icon: BarChart3 },
    { title: 'Award-winning operations team', desc: 'ISO 9001 certified operations with trained logistics professionals handling your cargo.', Icon: Award },
    { title: '24/7 Customer support', desc: 'Round-the-clock phone, email and live chat support for all your shipment inquiries.', Icon: Headphones },
    { title: 'Transparent pricing', desc: 'Upfront quotes with no hidden fees. Clear breakdown of shipping, insurance and customs.', Icon: Globe },
  ]
  return (
    <Section eyebrow="Why ArcBest" title="Why thousands of companies choose us" subtitle="Built for the way US businesses ship today — reliable, fast, and technology-first.">
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {rows.map(({ title, desc, Icon }) => (
          <div key={title} className="flex gap-4 sm:gap-5 p-5 sm:p-7 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-primary/10 boty-transition">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function FAQSection() {
  const faqs = [
    { q: 'How can I track my shipment?', a: 'Enter your tracking number in the search box at the top of the page, or log in to your customer dashboard for a complete list of your shipments with full timeline details. Tracking numbers are emailed to you immediately after creating a shipment.' },
    { q: 'What are the domestic delivery times?', a: 'Standard shipping: 2–3 business days between major cities and 3–5 days for remote areas. Express shipping: next-day delivery in major metropolitan areas. Premium shipping: same-day delivery in select service hubs.' },
    { q: 'Which international countries do you ship to?', a: 'We ship to over 190 countries worldwide via our air and sea freight partners, with reliable service to North America, Europe, Asia, and beyond.' },
    { q: 'How is shipping cost calculated?', a: 'Pricing is based on actual weight or dimensional weight (whichever is higher), origin, destination, and service level chosen. Use our Create Shipment form to get an instant transparent quote before paying.' },
    { q: 'Is my shipment insured?', a: 'Every shipment includes base carrier liability. Optional comprehensive cargo insurance is available at checkout covering loss, theft, and damage up to the full declared value of your goods.' },
    { q: 'What happens if my delivery is delayed?', a: 'Our operations team monitors every shipment proactively. If we detect a delay, we notify you immediately via your preferred channel. Late express deliveries qualify for service refunds as per our SLA.' },
  ]
  return (
    <Section id="faq" eyebrow="FAQ" title="Frequently asked questions" subtitle="Can't find the answer you're looking for? Reach out to our support team anytime.">
      <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
        {faqs.map((f, i) => {
          const [open, setOpen] = useState(false)
          return (
            <details key={i} className="group bg-card rounded-2xl logix-shadow overflow-hidden boty-transition border border-border" open={open}>
              <summary
                onClick={(e) => { e.preventDefault(); setOpen(!open) }}
                className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 cursor-pointer list-none text-foreground font-semibold hover:text-primary boty-transition"
              >
                <span className="text-sm sm:text-base">{f.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 boty-transition ${open ? 'rotate-180' : ''}`} />
              </summary>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            </details>
          )
        })}
      </div>
    </Section>
  )
}

function CTA() {
  const stats = useAppState().adminStats()
  const statCards = [
    { label: "Active shipments today", value: `${stats.active + stats.pending + 150}`, Icon: Package },
    { label: "Revenue processed", value: formatCurrency(stats.revenue * 4), Icon: BarChart3 },
    { label: "Delivered this month", value: `${stats.delivered * 8}`, Icon: CheckCircle2 },
    { label: "Customer growth", value: "+24%", Icon: Globe, accent: "text-emerald-300" },
  ]
  return (
    <section id="contact" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#0A52D9] to-accent p-6 sm:p-10 md:p-14 lg:p-16 text-white">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-1.5 text-white/90 text-xs sm:text-sm font-medium">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" /> Rated 4.9 / 5 by 5,000+ shippers
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 leading-tight text-balance">
                Ready to ship with confidence?
              </h2>
              <p className="text-base sm:text-lg text-white/80 mb-7 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Create your first shipment today. No contracts, no long-term commitments, no surprises. Pay only for what you ship.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto lg:mx-0">
                <Link
                  href="/customer/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold boty-transition hover:bg-white/90 cursor-pointer shadow-lg"
                >
                  <Package className="w-4 h-4" /> Create Account
                </Link>
                <a
                  href="tel:+18005550147"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold boty-transition hover:bg-white/20 cursor-pointer"
                >
                  <Headphones className="w-4 h-4" /> Talk to Sales
                </a>
              </div>
              <ul className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-sm text-white/75">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Free pickup</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Cancel anytime</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Insurance included</li>
              </ul>
            </div>
            <div className="w-full max-w-md lg:max-w-none mx-auto lg:ml-auto">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {statCards.map(({ label, value, Icon, accent }) => (
                  <div key={label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 sm:p-5 boty-transition hover:bg-white/15">
                    <div className="flex items-center gap-1.5 text-white/70 text-[11px] sm:text-xs">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="leading-tight">{label}</span>
                    </div>
                    <p className={`mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold ${accent || ""}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero />
      <StatsStrip />
      <Services />
      <HowItWorks />
      <Coverage />
      <WhyUs />
      <FAQSection />
      <CTA />
      <Footer />
      <LiveChatWidget />
    </main>
  )
}
