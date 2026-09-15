export type ShipmentStatus =
  | "Order Created"
  | "Shipment Confirmed"
  | "Package Picked Up"
  | "In Transit"
  | "Arrived at Facility"
  | "Out for Delivery"
  | "Delivered"
  | "Exception"

export type ShippingMethod = "Standard" | "Express" | "Priority" | "Freight"
export type PackageType = "Document" | "Parcel" | "Crate" | "Pallet"
export type AccountStatus = "Active" | "Pending" | "Suspended"
export type NotificationType = "shipment" | "delivery" | "exception" | "system"

export interface Address {
  name: string
  company?: string
  phone: string
  email: string
  line1: string
  city: string
  state?: string
  country: string
  postalCode: string
}

export interface Customer {
  id: string
  name: string
  email: string
  password: string
  phone: string
  location: string
  registeredAt: string
  lastActive: string
  status: AccountStatus
  company?: string
}

export interface TrackingEvent {
  id: string
  status: ShipmentStatus
  location: string
  timestamp: string
  description: string
}

export interface Shipment {
  id: string
  trackingNumber: string
  customerId: string
  origin: string
  destination: string
  sender: Address
  recipient: Address
  packageType: PackageType
  weightKg: number
  dimensions: string
  contents: string
  shippingMethod: ShippingMethod
  status: ShipmentStatus
  estimatedDelivery: string
  createdAt: string
  updatedAt: string
  currentLocation: string
  costNgn: number
  timeline: TrackingEvent[]
}

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
  href?: string
}

export interface ActivityEvent {
  id: string
  actor: string
  actorRole: "admin" | "customer" | "system"
  action: string
  target?: string
  timestamp: string
}

export type Session =
  | { kind: "admin"; username: string }
  | { kind: "customer"; userId: string }
  | null
