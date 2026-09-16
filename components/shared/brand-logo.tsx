export const BRAND_LOGO_URL = "https://res.cloudinary.com/qz5m8bhg/image/upload/v1789515575/logoo_uycwcr.png"

export function BrandLogo({ className = "", alt = "ArcBest" }: { className?: string; alt?: string }) {
  return (
    <img
      src={BRAND_LOGO_URL}
      alt={alt}
      className={className}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  )
}
