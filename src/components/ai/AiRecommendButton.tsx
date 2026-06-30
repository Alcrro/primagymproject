"use client"

import { useState } from "react"
import AiRecommendPanel from "./AiRecommendPanel"
import styles from "./AiRecommendButton.module.scss"

export default function AiRecommendButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={styles.banner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div className={styles.bannerText}>
            <span className={styles.bannerTitle}>Nu știi ce abonament să alegi?</span>
            <span className={styles.bannerSub}>6 întrebări rapide — AI-ul îți recomandă planul potrivit</span>
          </div>
        </div>
        <button className={styles.btn} onClick={() => setOpen(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Găsește abonamentul tău
        </button>
      </div>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <AiRecommendPanel onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
