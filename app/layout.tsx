import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/components/providers/query-provider'
import { LenisProvider } from '@/components/providers/lenis-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AppStateProvider } from '@/lib/app-state'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700']
});

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'Logix — Logistics & Shipment Tracking',
  description: 'Professional logistics platform for domestic and international shipping. Track shipments in real-time, create new deliveries, and manage your entire logistics operation.',
  generator: 'v0.app',
  keywords: ['logistics', 'shipping', 'delivery', 'cargo', 'courier', 'freight', 'tracking', 'shipment', 'supply chain', 'US logistics'],
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F8FB' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1120' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AppStateProvider>
              <LenisProvider>
                {children}
              </LenisProvider>
            </AppStateProvider>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
