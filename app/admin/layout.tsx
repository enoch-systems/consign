"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import {
  Shield, Lock, LayoutDashboard, Package, MapPinned, Users,
  BarChart3, Activity as ActivityIcon, Settings, Menu, X,
  Truck, LogOut, ChevronRight, Bell, Search, Store, MoreHorizontal,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Operations",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Shipments", href: "/admin/shipments", icon: Package },
      { name: "Tracking", href: "/admin/tracking", icon: MapPinned },
      { name: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Insights",
    items: [
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Activity Log", href: "/admin/activity", icon: ActivityIcon },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
] as const;

const MOBILE_TABS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Shipments", href: "/admin/shipments", icon: Package },
  { name: "Tracking", href: "/admin/tracking", icon: MapPinned },
  { name: "Users", href: "/admin/users", icon: Users },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { session, logout } = useAppState();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicAuthPath = ["/admin/login", "/admin/forgot-password", "/admin/update-password"].includes(pathname);
  const isAdmin = session?.role === "admin";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isAdmin && !isPublicAuthPath) router.replace("/admin/login");
  }, [isAdmin, isPublicAuthPath, router]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  if (isPublicAuthPath) return <>{children}</>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col ops-auth-grid">
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border bg-card shadow-xl shadow-foreground/[0.03]">
            <div className="pt-10 pb-8 px-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-2xl mb-2">Admin Access Required</h1>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                This area is restricted to administrators. Please sign in with admin credentials to continue.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent/10 transition"
                >
                  Back to Home
                </Link>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/92 shadow-lg shadow-primary/20 transition"
                >
                  <Lock className="w-4 h-4" />
                  Admin Sign In
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const doLogout = () => {
    logout();
    setLogoutOpen(false);
    router.push("/admin/login");
    router.refresh();
  };

  const runSearch = () => {
    const q = query.trim();
    router.push(q ? `/admin/shipments?q=${encodeURIComponent(q)}` : "/admin/shipments");
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname?.startsWith(href));

  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="flex items-center justify-between h-14 px-3 sm:px-4 gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 -ml-1 inline-flex items-center justify-center rounded-xl text-foreground/80 hover:text-foreground hover:bg-accent/10 transition active:scale-[0.97]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/30">
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base font-semibold">Logix</span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground mt-0.5">Ops</span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={runSearch}
              className="w-9 h-9 inline-flex items-center justify-center rounded-xl text-foreground/70 hover:text-foreground hover:bg-accent/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search shipments"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <ThemeToggle size="sm" />
            <button
              onClick={() => setLogoutOpen(true)}
              className="w-9 h-9 -mr-1 inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/15 transition active:scale-[0.97]"
              aria-label="Account"
            >
              <span className="font-serif text-sm font-semibold">A</span>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 xl:w-72 flex-col z-30 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-5 pt-5 pb-4 border-b border-sidebar-border/60">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-primary to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-semibold tracking-wide">Logix</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Operations Console</span>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
                          active
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        )}
                      >
                        <Icon className={cn("w-[18px] h-[18px] shrink-0", active ? "" : "opacity-90 group-hover:opacity-100")} />
                        <span className="flex-1 truncate">{item.name}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer / User card */}
          <div className="p-3 border-t border-sidebar-border/60">
            <div className="rounded-2xl p-3 bg-sidebar-accent/60 border border-sidebar-border/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 text-white flex items-center justify-center shadow-md shadow-primary/25">
                  <span className="font-serif font-semibold">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Administrator</p>
                  <p className="text-xs text-muted-foreground truncate">admin@logix.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle size="sm" />
                <button
                  onClick={() => setLogoutOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-card/60 dark:bg-background/40 border border-sidebar-border/80 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm animate-in fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-sidebar border-r border-sidebar-border shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/30">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-base font-semibold">Logix</span>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground mt-0.5">Operations</span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl text-foreground/70 hover:text-foreground hover:bg-accent/10 transition active:scale-[0.97]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User card */}
            <div className="px-4 pt-4 pb-3 border-b border-sidebar-border/60">
              <div className="rounded-2xl p-3.5 bg-gradient-to-br from-primary/10 via-primary/5 to-cyan-500/10 border border-primary/15">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-500 text-white flex items-center justify-center shadow-md shadow-primary/25">
                    <span className="font-serif text-base font-semibold">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Administrator</p>
                    <p className="text-xs text-muted-foreground truncate">admin@logix.com</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
              {NAV_SECTIONS.map((section) => (
                <div key={section.title}>
                  <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition active:scale-[0.98]",
                            active
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                          )}
                        >
                          <Icon className={cn("w-5 h-5 shrink-0", active ? "" : "opacity-90 group-hover:opacity-100")} />
                          <span className="flex-1">{item.name}</span>
                          {active && <ChevronRight className="w-4.5 h-4.5 opacity-80" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="p-3 border-t border-sidebar-border/60 pb-safe">
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-card/60 dark:bg-background/40 border border-sidebar-border/80 text-sm font-medium text-sidebar-foreground/80 hover:text-foreground transition"
                >
                  <Store className="w-4 h-4" />
                  Back to Site
                </Link>
                <button
                  onClick={() => setLogoutOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/15 transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Top Bar */}
      <header className="hidden lg:flex sticky top-0 z-20 lg:pl-64 xl:pl-72">
        <div className="flex-1 border-b border-border/60 bg-background/75 backdrop-blur-xl">
          <div className="h-16 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runSearch();
                    }
                  }}
                  placeholder="Search shipments or customers…"
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/activity"
                className="relative w-10 h-10 inline-flex items-center justify-center rounded-xl text-foreground/70 hover:text-foreground hover:bg-accent/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Activity log"
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-destructive" />
              </Link>
              <div className="w-px h-6 bg-border/80 mx-1" />
              <button
                onClick={() => setLogoutOpen(true)}
                className="inline-flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-xl hover:bg-accent/10 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 text-white flex items-center justify-center shadow-sm shadow-primary/30">
                  <span className="font-serif text-sm font-semibold">A</span>
                </div>
                <div className="text-left leading-tight hidden xl:block">
                  <p className="text-sm font-semibold">Admin</p>
                  <p className="text-[11px] text-muted-foreground">Supervisor</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:pl-64 xl:pl-72 pb-24 lg:pb-10">
        <div className="px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Primary"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl pb-safe"
      >
        <div className="grid grid-cols-5 h-16">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <span className="absolute top-0 w-8 h-0.5 rounded-full bg-primary" aria-hidden="true" />
                )}
                <Icon className={cn("w-5 h-5", active ? "drop-shadow-[0_2px_6px_rgba(11,95,255,0.45)]" : "")} />
                {tab.name}
              </Link>
            );
          })}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="More menu"
          >
            <MoreHorizontal className="w-5 h-5" />
            More
          </button>
        </div>
      </nav>

      {/* Logout confirm modal */}
      {logoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/40 animate-in fade-in"
            onClick={() => setLogoutOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-7 animate-in slide-in-from-bottom-2 sm:slide-in-from-bottom-0 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl mb-1.5">Sign out of Operations?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You&apos;ll need to re-enter your credentials to access the control center again.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="flex-1 inline-flex items-center justify-center h-11 rounded-xl border border-border text-sm font-medium hover:bg-accent/10 transition active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={doLogout}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/92 shadow-lg shadow-destructive/20 transition active:scale-[0.98]"
              >
                <LogOut className="w-4.5 h-4.5" />
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
