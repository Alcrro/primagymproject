"use client"

import { useState } from "react"
import type { ClientProfile } from "@prisma/client"
import AiIntakeModal from "@/components/ai/AiIntakeModal"
import ClientProfileCard from "./ClientProfileCard"
import styles from "./ClientProfileSection.module.scss"

interface IClientProfileSectionProps {
  profile: ClientProfile | null
}

export default function ClientProfileSection({ profile }: IClientProfileSectionProps) {
  const [open, setOpen] = useState(false)

  function closeHandler() {
    setOpen(false)
    window.location.reload()
  }

  return (
    <>
      {profile ? (
        <div className={styles.hasProfile}>
          <ClientProfileCard profile={profile} />
          <button className={styles.updateBtn} onClick={() => setOpen(true)}>
            Actualizează fișa
          </button>
        </div>
      ) : (
        <button className={styles.banner} onClick={() => setOpen(true)}>
          <div className={styles.bannerIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className={styles.bannerText}>
            <span className={styles.bannerTitle}>Completează fișa ta de client</span>
            <span className={styles.bannerSub}>Ajută antrenorul să știe mai bine cum te poate sprijini</span>
          </div>
          <div className={styles.bannerArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </button>
      )}

      {open && <AiIntakeModal onClose={closeHandler} />}
    </>
  )
}
