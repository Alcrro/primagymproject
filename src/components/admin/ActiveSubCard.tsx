"use client"

import { useState } from "react"
import { IActiveSub } from "@/types/qr"
import styles from "./scanner.module.scss"

interface ActiveSubCardProps {
  sub: IActiveSub
  memberUserId: string
  onCheckIn: (orderItemId: number, newRemaining: number | null) => void
}

interface CheckInResponse {
  remainingEntries: number | null
  error?: string
}

export default function ActiveSubCard({ sub, memberUserId, onCheckIn }: ActiveSubCardProps) {
  const [loading, setLoading] = useState(false)
  const [localRemaining, setLocalRemaining] = useState<number | undefined>(sub.remainingEntries)
  const [done, setDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleMarkEntry() {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderItemId: sub.orderItemId, memberUserId }),
      })
      const data = await res.json() as CheckInResponse
      if (!res.ok) {
        setErrorMsg(data.error ?? "Eroare necunoscută")
        return
      }
      const newRemaining = data.remainingEntries
      if (typeof newRemaining === "number") {
        setLocalRemaining(newRemaining)
      }
      setDone(true)
      onCheckIn(sub.orderItemId, newRemaining)
    } catch {
      setErrorMsg("Eroare de rețea. Încearcă din nou.")
    } finally {
      setLoading(false)
    }
  }

  const expiresLabel =
    sub.expiresAt
      ? new Date(sub.expiresAt).toLocaleDateString("ro-RO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : null

  return (
    <div className={`${styles.subCard}${done ? ` ${styles.subCardDone}` : ""}`}>
      <div className={styles.subInfo}>
        <p className={styles.subCategory}>
          {sub.categoryName.charAt(0).toUpperCase() + sub.categoryName.slice(1)}
        </p>
        <p className={styles.subName}>{sub.planName}</p>
        {sub.type === "entries" && (
          <p className={styles.subMeta}>
            {localRemaining ?? sub.remainingEntries} / {sub.totalEntries} intrări rămase
          </p>
        )}
        {sub.type === "monthly" && expiresLabel && (
          <p className={styles.subMeta}>Expiră: {expiresLabel}</p>
        )}
      </div>

      {errorMsg && <p className={styles.subError}>{errorMsg}</p>}

      {done ? (
        <div className={styles.checkInSuccess}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Intrare marcată
        </div>
      ) : (
        <button
          className={styles.checkInBtn}
          onClick={handleMarkEntry}
          disabled={loading}
        >
          {loading ? "Se procesează..." : "Marchează intrare"}
        </button>
      )}
    </div>
  )
}
