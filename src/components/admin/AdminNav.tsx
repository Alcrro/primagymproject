"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import "./adminNav.scss"

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/admin/antrenori", label: "Antrenori", icon: "bi-person-badge" },
  { href: "/admin/utilizatori", label: "Utilizatori", icon: "bi-people" },
  { href: "/admin/sesiuni", label: "Sesiuni", icon: "bi-calendar-event" },
  { href: "/admin/locatii", label: "Locații", icon: "bi-geo-alt" },
  { href: "/admin/abonamente", label: "Abonamente", icon: "bi-credit-card" },
  { href: "/admin/discounturi", label: "Discounturi", icon: "bi-tag" },
  { href: "/admin/galerie", label: "Galerie", icon: "bi-images" },
  { href: "/admin/check-ins", label: "Check-ins", icon: "bi-list-check" },
  { href: "/admin/scan", label: "Scanner", icon: "bi-qr-code-scan" },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="an-nav">
      <div className="an-inner">
        <span className="an-label">Admin</span>
        <div className="an-links">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`an-link${isActive ? " an-link--active" : ""}`}
              >
                <i className={`bi ${link.icon}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
