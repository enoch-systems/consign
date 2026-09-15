"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Package, LogOut, User, Bell, LayoutDashboard, Truck, BarChart3, Activity, Settings, Users, MapPinned } from "lucide-react"
import { useAppState } from "@/lib/app-state"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { cn } from "@/lib/utils"

type Variant = "default" | "admin" | "customer"

export function Header({ variant = "default" }: { variant?: Variant } = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { session, currentCustomer, logout, unreadCount } = useAppState()
  const router = useRouter()
  const pathname = usePathname()

  const isAdmin = variant === "admin"
  const isCustomer = variant === "customer" || (session?.role === "customer" && variant === "default")
  const unread = session?.role === "customer" ? unreadCount(session.userId) : 0
  const adminDesktopClass = isAdmin ? "xl:flex" : "lg:flex"
  const adminMobileClass = isAdmin ? "xl:hidden" : "lg:hidden"

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    setShowLogoutModal(false)
    router.push(isAdmin ? "/admin/login" : "/")
    router.refresh()
  }

  const navLinks = isAdmin
    ? [
        { name: "Dashboard", href: "/admin" },
        { name: "Shipments", href: "/admin/shipments" },
        { name: "Tracking", href: "/admin/tracking" },
        { name: "Users", href: "/admin/users" },
        { name: "Analytics", href: "/admin/analytics" },
        { name: "Activity", href: "/admin/activity" },
        { name: "Settings", href: "/admin/settings" },
      ]
    : isCustomer
    ? [
        { name: "Dashboard", href: "/customer/dashboard" },
        { name: "Shipments", href: "/customer/shipments" },
        { name: "New Shipment", href: "/customer/shipments/new" },
        { name: "Notifications", href: "/customer/notifications", badge: unread },
        { name: "Profile", href: "/customer/profile" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Coverage", href: "/#coverage" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
      ]

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    return pathname === href || (href !== '/' && pathname?.startsWith(href))
  }

  const Brand = ({ centered = false }: { centered?: boolean }) => (
    <Link href={isAdmin ? "/admin" : isCustomer ? "/customer/dashboard" : "/"} className={cn(centered && "lg:absolute lg:left-1/2 lg:-translate-x-1/2")}>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md shadow-primary/30">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="font-serif text-xl sm:text-2xl tracking-wide text-foreground font-semibold">
          Logix
        </span>
      </div>
    </Link>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <nav className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-md rounded-2xl animate-scale-fade-in bg-background/70 border border-border/60 logix-shadow">
        <div className="relative z-50 flex items-center justify-between h-[68px] gap-2">
          {/* Mobile menu button */}
          <button
            type="button"
            className={cn(adminMobileClass, "p-2 text-foreground/80 hover:text-foreground boty-transition cursor-pointer rounded-lg")}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Left: Brand */}
          <div className={cn("flex-shrink-0", adminMobileClass)}>
            <Brand />
          </div>
          <div className={cn("hidden items-center gap-8", adminDesktopClass)}>
            <Brand />
          </div>

          {/* Center Nav for public */}
          {!isAdmin && !isCustomer && (
            <div className="hidden lg:flex items-center gap-7 ml-4">
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm tracking-wide hover:text-primary boty-transition whitespace-nowrap",
                    isActive(link.href) ? "text-primary font-medium" : "text-foreground/70",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {isAdmin && (
            <div className="hidden xl:flex items-center gap-1 ml-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-2.5 py-2 rounded-lg text-sm tracking-wide boty-transition whitespace-nowrap",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:bg-accent/10 hover:text-primary",
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <NavIcon name={link.name} />
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {isCustomer && (
            <div className="hidden lg:flex items-center gap-1 ml-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 rounded-lg text-sm tracking-wide boty-transition whitespace-nowrap inline-flex items-center gap-2",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:bg-accent/10 hover:text-primary",
                  )}
                >
                  {link.name}
                  {link.badge && link.badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle size="sm" />

            {variant === "default" && !session && (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link
                  href="/customer/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm tracking-wide text-foreground/80 hover:text-primary hover:bg-accent/10 boty-transition"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  href="/customer/signup"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide bg-primary text-primary-foreground boty-transition hover:bg-primary/90 shadow-sm shadow-primary/30"
                >
                  <Package className="w-4 h-4" /> Get Started
                </Link>
              </div>
            )}

            {variant === "default" && session?.role === "customer" && (
              <div className="hidden sm:flex items-center gap-1 ml-2">
                <Link
                  href="/customer/notifications"
                  className="relative p-2 rounded-full text-foreground/70 hover:text-primary hover:bg-accent/10 boty-transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </Link>
                <Link
                  href="/customer/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm tracking-wide bg-primary/10 text-primary hover:bg-primary/20 boty-transition"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </div>
            )}

            {(isAdmin || isCustomer) && (
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center gap-2 ml-1 sm:ml-2 bg-destructive/10 text-destructive px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm tracking-wide boty-transition hover:bg-destructive/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
              adminMobileClass,
              "overflow-hidden boty-transition relative z-[60]",
              isMenuOpen ? "max-h-[calc(100vh-110px)] overflow-y-auto pb-6 pointer-events-auto" : "max-h-0 pointer-events-none",
          )}
        >
          <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "relative z-[60] flex items-center justify-between px-4 py-3 rounded-xl text-sm tracking-wide boty-transition cursor-pointer",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground/80 hover:bg-accent/10 hover:text-primary",
                )}
              >
                <span className="flex items-center gap-3">
                  <NavIcon name={link.name} />
                  {link.name}
                </span>
                {link.badge && link.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                    {link.badge > 99 ? '99+' : link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-border/50 px-4 space-y-3">
              {variant === "default" && !session && (
                <>
                  <Link
                    href="/customer/login"
                    className="block w-full text-center py-3 rounded-full border border-border text-foreground text-sm boty-transition hover:bg-accent/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/customer/signup"
                    className="block w-full text-center py-3 rounded-full bg-primary text-primary-foreground text-sm boty-transition hover:bg-primary/90"
                  >
                    Create Account
                  </Link>
                </>
              )}
              {variant === "default" && session?.role === "customer" && (
                <>
                  <Link
                    href="/customer/dashboard"
                    className="block w-full text-center py-3 rounded-full bg-primary/10 text-primary text-sm boty-transition"
                  >
                    Go to Dashboard
                  </Link>
                </>
              )}
              {(isAdmin || isCustomer) && (
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full py-3 rounded-full bg-destructive/10 text-destructive text-sm boty-transition hover:bg-destructive/20 cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={() => setShowLogoutModal(false)}
          />
          <div
            className="relative bg-card rounded-2xl max-w-md w-full logix-shadow border border-border/50 p-6 animate-scale-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-2xl text-foreground mb-3">Confirm Logout</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-6 py-3 rounded-full text-sm tracking-wide boty-transition hover:bg-foreground/5 cursor-pointer"
              >
                No, Stay logged in
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-destructive/10 text-destructive px-6 py-3 rounded-full text-sm tracking-wide boty-transition hover:bg-destructive/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavIcon({ name }: { name: string }) {
  const icons = {
    Dashboard: LayoutDashboard,
    Shipments: Package,
    Tracking: MapPinned,
    Users,
    Analytics: BarChart3,
    Activity,
    Settings,
    "New Shipment": Package,
    Notifications: Bell,
    Profile: User,
  }
  const Icon = icons[name as keyof typeof icons] || ArrowIcon
  return <Icon className="h-4 w-4 shrink-0" />
}

function ArrowIcon() {
  return <span className="h-1.5 w-1.5 rounded-full bg-current" />
}
