import React from "react"
import "./footer.scss"
import Contact from "./contact/Contact"
import Program from "./program/Program"
import FooterModal from "./footerModal/FooterModal"
import SocialMedia from "./socialMedia/SocialMedia"
import { information } from "@/app/_core/information"
import { rules } from "@/app/_core/rules"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <Contact />
        <Program />
        <FooterModal links={information} title="Informații" slug="informatii" />
        <FooterModal links={rules} title="Regulament" slug="regulament" />
      </div>

      <div className="footer-bottom">
        <SocialMedia />
        <p className="footer-copyright">© {year} ApexFit. Toate drepturile rezervate.</p>
      </div>
    </footer>
  )
}
