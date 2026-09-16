"use client"

import Link from "next/link"
import { useState } from "react"
import { Phone, Mail, MapPin } from "lucide-react"
import { useAppState } from "@/lib/app-state"
import { PolicyModal } from "@/components/shared/policy-modal"
import { BrandLogo } from "@/components/shared/brand-logo"

const footerLinks = {
  company: [
    { name: "About Us", href: "#" },
    { name: "Services", href: "/#services" },
    { name: "Coverage", href: "/#coverage" },
    { name: "Careers", href: "#" },
  ],
  customer: [
    { name: "Track Shipment", href: "/#track" },
    { name: "Create Shipment", href: "/customer/shipments/new" },
    { name: "My Account", href: "/customer/login" },
    { name: "FAQ", href: "/faq" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Help Center", href: "/faq" },
    { name: "Shipping Policy", href: "/faq" },
    { name: "Terms of Service", href: "#" },
  ]
}

export function Footer() {
  const { session } = useAppState()
  const [policy, setPolicy] = useState<"privacy" | "terms" | "shipping" | null>(null)
  const accountHref = session?.role === "customer" ? "/customer/dashboard" : "/customer/login"

  const openPolicy = (name: string) => {
    if (name === "Privacy Policy") setPolicy("privacy")
    if (name === "Terms of Service") setPolicy("terms")
    if (name === "Shipping Policy") setPolicy("shipping")
  }

  return (
    <footer className="bg-card pt-16 pb-8 relative overflow-hidden border-t border-border/50 mt-16">
      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-serif text-[140px] md:text-[300px] font-bold text-foreground/5 whitespace-nowrap leading-none">
          ARCBEST
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <BrandLogo className="h-10 w-10 rounded-xl object-contain" />
              <span className="font-serif text-2xl font-semibold text-foreground">ArcBest</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
              Your trusted logistics partner for domestic and international shipping. Fast, reliable, and transparent delivery services across the United States and beyond.
            </p>
            <div className="space-y-3 mb-6 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a href="tel:+18005550147" className="hover:text-primary boty-transition">+1 (800) 555-0147</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a href="mailto:support@arcbest.com" className="hover:text-primary boty-transition">support@arcbest.com</a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>100 Market Street, New York, NY 10001</span>
              </div>
            </div>
          </div>

          {[
            { title: "Company", links: footerLinks.company },
            { title: "Customer", links: footerLinks.customer },
            { title: "Support", links: footerLinks.support },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-foreground mb-4">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {link.name === "My Account" ? (
                      <Link href={accountHref} className="text-sm text-muted-foreground hover:text-primary boty-transition">
                        {link.name}
                      </Link>
                    ) : link.name === "Shipping Policy" || link.name === "Terms of Service" ? (
                      <button type="button" onClick={() => openPolicy(link.name)} className="text-sm text-muted-foreground hover:text-primary boty-transition">
                        {link.name}
                      </button>
                    ) : (
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary boty-transition">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <button type="button" onClick={() => openPolicy("Privacy Policy")} className="hover:text-primary boty-transition">Privacy Policy</button>
            <button type="button" onClick={() => openPolicy("Terms of Service")} className="hover:text-primary boty-transition">Terms of Service</button>
            <button type="button" onClick={() => openPolicy("Shipping Policy")} className="hover:text-primary boty-transition">Shipping Policy</button>
            <Link href="/contact" className="hover:text-primary boty-transition">Contact Support</Link>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} ArcBest Logistics LLC. All Rights Reserved.
          </p>
        </div>
      </div>
      <PolicyModal type={policy} onClose={() => setPolicy(null)} />
    </footer>
  )
}
