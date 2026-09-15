"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  generateTrackingNumber,
  seedActivity,
  seedCustomers,
  seedNotifications,
  seedShipments,
} from "@/lib/mock-data"
import { locationForStatus } from "@/lib/status"
import type {
  ActivityEvent,
  Address,
  AppNotification,
  Customer,
  PackageType,
  Session,
  Shipment,
  ShipmentStatus,
  ShippingMethod,
} from "@/lib/types"

const STORAGE_KEY = "consign-platform-v1"

interface PersistedState {
  customers: Customer[]
  shipments: Shipment[]
  notifications: AppNotification[]
  activity: ActivityEvent[]
  session: Session
}

interface CreateShipmentInput {
  origin: string
  destination: string
  sender: Address
  recipient: Address
  packageType: PackageType
  weightKg: number
  dimensions: string
  contents: string
  shippingMethod: ShippingMethod
  estimatedDelivery: string
  costNgn: number
}

interface PlatformContextValue {
  hydrated: boolean
  customers: Customer[]
  shipments: Shipment[]
  notifications: AppNotification[]
  activity: ActivityEvent[]
  session: Session
  currentCustomer: Customer | null
  isAdmin: boolean
  loginCustomer: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  signupCustomer: (input: {
    name: string
    email: string
    password: string
    phone: string
    location: string
    company?: string
  }) => { ok: true } | { ok: false; error: string }
  loginAdmin: (username: string, password: string) => { ok: true } | { ok: false; error: string }
  logout: () => void
  createShipment: (input: CreateShipmentInput) => Shipment | { error: string }
  updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, note?: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (userId: string) => void
  updateProfile: (patch: Partial<Pick<Customer, "name" | "phone" | "location" | "company">>) => void
}

const PlatformContext = createContext<PlatformContextValue | null>(null)

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return {
      customers: seedCustomers,
      shipments: seedShipments,
      notifications: seedNotifications,
      activity: seedActivity,
      session: null,
    }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        customers: seedCustomers,
        shipments: seedShipments,
        notifications: seedNotifications,
        activity: seedActivity,
        session: null,
      }
    }
    const parsed = JSON.parse(raw) as PersistedState
    return {
      customers: parsed.customers?.length ? parsed.customers : seedCustomers,
      shipments: parsed.shipments?.length ? parsed.shipments : seedShipments,
      notifications: parsed.notifications ?? seedNotifications,
      activity: parsed.activity ?? seedActivity,
      session: parsed.session ?? null,
    }
  } catch {
    return {
      customers: seedCustomers,
      shipments: seedShipments,
      notifications: seedNotifications,
      activity: seedActivity,
      session: null,
    }
  }
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers)
  const [shipments, setShipments] = useState<Shipment[]>(seedShipments)
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications)
  const [activity, setActivity] = useState<ActivityEvent[]>(seedActivity)
  const [session, setSession] = useState<Session>(null)

  useEffect(() => {
    const loaded = loadState()
    setCustomers(loaded.customers)
    setShipments(loaded.shipments)
    setNotifications(loaded.notifications)
    setActivity(loaded.activity)
    setSession(loaded.session)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const payload: PersistedState = {
      customers,
      shipments,
      notifications,
      activity,
      session,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [hydrated, customers, shipments, notifications, activity, session])

  const currentCustomer = useMemo(() => {
    if (session?.kind !== "customer") return null
    return customers.find((c) => c.id === session.userId) ?? null
  }, [customers, session])

  const isAdmin = session?.kind === "admin"

  const pushActivity = useCallback((event: Omit<ActivityEvent, "id" | "timestamp"> & { timestamp?: string }) => {
    setActivity((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: event.timestamp ?? new Date().toISOString(),
        ...event,
      },
      ...prev,
    ])
  }, [])

  const loginCustomer = useCallback(
    (email: string, password: string) => {
      const match = customers.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password,
      )
      if (!match) return { ok: false as const, error: "Those credentials do not match a customer account." }
      setSession({ kind: "customer", userId: match.id })
      setCustomers((prev) =>
        prev.map((c) => (c.id === match.id ? { ...c, lastActive: new Date().toISOString() } : c)),
      )
      return { ok: true as const }
    },
    [customers],
  )

  const signupCustomer = useCallback(
    (input: {
      name: string
      email: string
      password: string
      phone: string
      location: string
      company?: string
    }) => {
      if (customers.some((c) => c.email.toLowerCase() === input.email.trim().toLowerCase())) {
        return { ok: false as const, error: "An account with that email already exists." }
      }
      const now = new Date().toISOString()
      const customer: Customer = {
        id: `usr_${Date.now()}`,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        phone: input.phone.trim(),
        location: input.location.trim(),
        company: input.company?.trim(),
        registeredAt: now,
        lastActive: now,
        status: "Active",
      }
      setCustomers((prev) => [customer, ...prev])
      setSession({ kind: "customer", userId: customer.id })
      pushActivity({
        actor: customer.name,
        actorRole: "customer",
        action: "Registered a new account",
      })
      return { ok: true as const }
    },
    [customers, pushActivity],
  )

  const loginAdmin = useCallback((username: string, password: string) => {
    if (username.trim() === "admin" && password === "admin") {
      setSession({ kind: "admin", username: "admin" })
      pushActivity({
        actor: "Operations",
        actorRole: "admin",
        action: "Signed in to the operations console",
      })
      return { ok: true as const }
    }
    return { ok: false as const, error: "Admin sign-in failed. Check the username and password." }
  }, [pushActivity])

  const logout = useCallback(() => {
    setSession(null)
  }, [])

  const createShipment = useCallback(
    (input: CreateShipmentInput) => {
      if (session?.kind !== "customer") {
        return { error: "Sign in as a customer to book a shipment." }
      }
      const now = new Date().toISOString()
      const trackingNumber = generateTrackingNumber()
      const shipment: Shipment = {
        id: `shp_${trackingNumber.toLowerCase()}`,
        trackingNumber,
        customerId: session.userId,
        origin: input.origin,
        destination: input.destination,
        sender: input.sender,
        recipient: input.recipient,
        packageType: input.packageType,
        weightKg: input.weightKg,
        dimensions: input.dimensions,
        contents: input.contents,
        shippingMethod: input.shippingMethod,
        status: "Order Created",
        estimatedDelivery: input.estimatedDelivery,
        createdAt: now,
        updatedAt: now,
        currentLocation: input.origin,
        costNgn: input.costNgn,
        timeline: [
          {
            id: `ev_${Date.now()}`,
            status: "Order Created",
            location: input.origin,
            timestamp: now,
            description: "Shipment booked from customer dashboard.",
          },
        ],
      }
      setShipments((prev) => [shipment, ...prev])
      const customer = customers.find((c) => c.id === session.userId)
      setNotifications((prev) => [
        {
          id: `ntf_${Date.now()}`,
          userId: session.userId,
          type: "shipment",
          title: `${trackingNumber} created`,
          message: `Your shipment to ${input.destination} is booked. Tracking is live.`,
          createdAt: now,
          read: false,
          href: `/track/${trackingNumber}`,
        },
        ...prev,
      ])
      pushActivity({
        actor: customer?.name ?? "Customer",
        actorRole: "customer",
        action: `Created shipment ${trackingNumber} to ${input.destination}`,
        target: trackingNumber,
      })
      return shipment
    },
    [customers, pushActivity, session],
  )

  const updateShipmentStatus = useCallback(
    (shipmentId: string, status: ShipmentStatus, note?: string) => {
      const now = new Date().toISOString()
      setShipments((prev) =>
        prev.map((shipment) => {
          if (shipment.id !== shipmentId && shipment.trackingNumber !== shipmentId) {
            return shipment
          }
          const location = locationForStatus(status, shipment.origin, shipment.destination)
          const event = {
            id: `ev_${Date.now()}`,
            status,
            location,
            timestamp: now,
            description: note?.trim() || `Status updated to ${status}.`,
          }
          return {
            ...shipment,
            status,
            updatedAt: now,
            currentLocation: location,
            timeline: [...shipment.timeline, event],
          }
        }),
      )
      const shipment = shipments.find((s) => s.id === shipmentId || s.trackingNumber === shipmentId)
      if (shipment) {
        setNotifications((prev) => [
          {
            id: `ntf_${Date.now()}`,
            userId: shipment.customerId,
            type: status === "Exception" ? "exception" : status === "Delivered" ? "delivery" : "shipment",
            title: `${shipment.trackingNumber} is now ${status}`,
            message: note?.trim() || `Current location: ${locationForStatus(status, shipment.origin, shipment.destination)}`,
            createdAt: now,
            read: false,
            href: `/track/${shipment.trackingNumber}`,
          },
          ...prev,
        ])
        pushActivity({
          actor: "Operations",
          actorRole: "admin",
          action: `Updated ${shipment.trackingNumber} to ${status}`,
          target: shipment.trackingNumber,
        })
      }
    },
    [pushActivity, shipments],
  )

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications((prev) => prev.map((n) => (n.userId === userId ? { ...n, read: true } : n)))
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<Pick<Customer, "name" | "phone" | "location" | "company">>) => {
      if (session?.kind !== "customer") return
      setCustomers((prev) =>
        prev.map((c) => (c.id === session.userId ? { ...c, ...patch, lastActive: new Date().toISOString() } : c)),
      )
    },
    [session],
  )

  const value = useMemo<PlatformContextValue>(
    () => ({
      hydrated,
      customers,
      shipments,
      notifications,
      activity,
      session,
      currentCustomer,
      isAdmin,
      loginCustomer,
      signupCustomer,
      loginAdmin,
      logout,
      createShipment,
      updateShipmentStatus,
      markNotificationRead,
      markAllNotificationsRead,
      updateProfile,
    }),
    [
      activity,
      createShipment,
      currentCustomer,
      customers,
      hydrated,
      isAdmin,
      loginAdmin,
      loginCustomer,
      logout,
      markAllNotificationsRead,
      markNotificationRead,
      notifications,
      session,
      shipments,
      signupCustomer,
      updateProfile,
      updateShipmentStatus,
    ],
  )

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) {
    throw new Error("usePlatform must be used within PlatformProvider")
  }
  return ctx
}
