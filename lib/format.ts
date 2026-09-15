import { format, parseISO } from "date-fns"

export function formatDate(value: string) {
  return format(parseISO(value), "d MMM yyyy")
}

export function formatDateTime(value: string) {
  return format(parseISO(value), "d MMM yyyy, HH:mm")
}

export function formatNgn(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompact(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount)
}
