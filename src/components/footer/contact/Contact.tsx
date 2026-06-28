import React from "react"
import { contact } from "@/app/_core/contact"

export default function Contact() {
  return (
    <div className="footer-section">
      <h3 className="footer-section-title">Contact</h3>
      <ul className="footer-list">
        {contact.map((item) => (
          <li key={item.label} className="footer-list-item">
            <span className="footer-list-label">{item.label}</span>
            {item.href ? (
              <a href={item.href} className="footer-list-link">{item.value}</a>
            ) : (
              <span className="footer-list-value">{item.value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
