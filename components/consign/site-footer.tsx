import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold">Consign</p>
          <p className="mt-2 max-w-sm text-sm text-primary-foreground/75">
            A modern logistics platform for booking consignments, managing handoffs, and keeping customers informed at every step.
          </p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="flex flex-col gap-2">
            <Link href="/track" className="hover:underline">
              Track a shipment
            </Link>
            <Link href="/login" className="hover:underline">
              Customer sign in
            </Link>
            <Link href="/login?role=admin" className="hover:underline">
              Operations console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
