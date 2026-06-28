import React from "react"
import Link from "next/link"
import type { IFooterLink } from "@/types/footer"

interface IFooterModalProps {
  links: IFooterLink[]
  title: string
  slug: string
}

export default function FooterModal({ links, title, slug }: IFooterModalProps) {
  return (
    <div className="footer-section">
      <h3 className="footer-section-title">{title}</h3>
      <ul className="footer-list">
        {links.map((item) => (
          <li key={item.link}>
            <Link href={`/${slug}/${item.link}`} className="footer-nav-link">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
