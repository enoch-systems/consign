import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { PlatformProvider } from "@/lib/platform-context"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Consign | Freight visibility platform",
  description:
    "A professional logistics platform for booking consignments, tracking movements, and managing shipments across Nigeria and international lanes.",
  generator: "v0.app",
  keywords: ["logistics", "shipping", "tracking", "freight", "Nigeria", "delivery"],
}

export const viewport: Viewport = {
  themeColor: "#0B3A5B",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <PlatformProvider>
          {children}
          <Toaster position="top-right" />
        </PlatformProvider>
        <Analytics />
      </body>
    </html>
  )
}
