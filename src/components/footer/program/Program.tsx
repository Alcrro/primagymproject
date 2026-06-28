import React from "react"
import { program } from "@/app/_core/program"

export default function Program() {
  return (
    <div className="footer-section">
      <h3 className="footer-section-title">Program</h3>
      <ul className="footer-list">
        {program.map((item) => (
          <li key={item.day} className="footer-list-item footer-program-row">
            <span className="footer-list-label">{item.day}</span>
            <span className={item.closed ? "footer-program-closed" : "footer-program-hours"}>
              {item.hours}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
