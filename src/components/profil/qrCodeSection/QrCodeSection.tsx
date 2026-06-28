"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { QRCodeSVG } from "qrcode.react"
import styles from "./QrCodeSection.module.scss"

const TOKEN_TTL_SECONDS = 300

export default function QrCodeSection() {
  const [token, setToken] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(TOKEN_TTL_SECONDS)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchToken = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch("/api/qr/token")
      if (!res.ok) throw new Error("Eroare la generarea QR")
      const data = await res.json() as { token: string }
      setToken(data.token)
      setSecondsLeft(TOKEN_TTL_SECONDS)
    } catch {
      setError("Nu s-a putut genera codul QR. Încearcă din nou.")
    }
  }, [])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  useEffect(() => {
    if (!token) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchToken()
          return TOKEN_TTL_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [token, fetchToken])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const countdown = `${minutes}:${String(seconds).padStart(2, "0")}`

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <path d="M14 14h3v3M17 17h3v3M14 20h3" />
          </svg>
        </div>
        <h2 className={styles.title}>QR Acces</h2>
      </div>

      <p className={styles.subtitle}>
        Prezintă acest cod la intrare pentru a marca o ședință.
      </p>

      <div className={styles.qrWrap}>
        {error ? (
          <div className={styles.errorState}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn} onClick={fetchToken}>
              Reîncearcă
            </button>
          </div>
        ) : token ? (
          <QRCodeSVG value={token} size={200} />
        ) : (
          <div className={styles.skeleton} />
        )}
      </div>

      {token && !error && (
        <div className={styles.countdown}>
          <span className={styles.countdownLabel}>Expiră în</span>
          <span className={styles.countdownValue}>{countdown}</span>
        </div>
      )}
    </div>
  )
}
