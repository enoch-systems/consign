import type { ShipmentStatus } from "@/lib/types"

export const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "Order Created",
  "Shipment Confirmed",
  "Package Picked Up",
  "In Transit",
  "Arrived at Facility",
  "Out for Delivery",
  "Delivered",
  "Exception",
]

export const ACTIVE_STATUSES: ShipmentStatus[] = [
  "Shipment Confirmed",
  "Package Picked Up",
  "In Transit",
  "Arrived at Facility",
  "Out for Delivery",
]

export const PENDING_STATUSES: ShipmentStatus[] = ["Order Created"]

export function statusTone(status: ShipmentStatus): {
  className: string
  label: string
} {
  switch (status) {
    case "Delivered":
      return {
        label: status,
        className: "bg-emerald-50 text-emerald-800 border-emerald-200",
      }
    case "Exception":
      return {
        label: status,
        className: "bg-red-50 text-red-800 border-red-200",
      }
    case "Out for Delivery":
      return {
        label: status,
        className: "bg-sky-50 text-sky-800 border-sky-200",
      }
    case "In Transit":
    case "Arrived at Facility":
      return {
        label: status,
        className: "bg-amber-50 text-amber-900 border-amber-200",
      }
    case "Package Picked Up":
    case "Shipment Confirmed":
      return {
        label: status,
        className: "bg-indigo-50 text-indigo-800 border-indigo-200",
      }
    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700 border-slate-200",
      }
  }
}

export function locationForStatus(status: ShipmentStatus, origin: string, destination: string): string {
  switch (status) {
    case "Order Created":
    case "Shipment Confirmed":
      return origin
    case "Package Picked Up":
      return `${origin} origin hub`
    case "In Transit":
      return "In transit network"
    case "Arrived at Facility":
      return `${destination} sorting facility`
    case "Out for Delivery":
      return `${destination} last-mile depot`
    case "Delivered":
      return destination
    case "Exception":
      return `${destination} exception desk`
    default:
      return origin
  }
}
