"use client"

import React, { useState } from "react"
import styles from "./SchimbareParola.module.scss"

export default function SchimbareParola() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError("Parolele noi nu coincid")
      return
    }
    if (newPassword.length < 8) {
      setError("Parola nouă trebuie să aibă minim 8 caractere")
      return
    }

    setPending(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "A apărut o eroare. Încearcă din nou.")
      } else {
        setSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch {
      setError("A apărut o eroare. Încearcă din nou.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 className={styles.title}>Securitate</h2>
      </div>

      {success && (
        <div className={styles.successMessage}>
          Parola a fost schimbată cu succes.
        </div>
      )}

      <form onSubmit={submitHandler} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="currentPassword">Parola curentă</label>
          <input
            id="currentPassword"
            type="password"
            required
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.field}>
          <label htmlFor="newPassword">Parolă nouă</label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            placeholder="Minim 8 caractere"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">Confirmă parola nouă</label>
          <input
            id="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">{error}</p>
        )}

        <button type="submit" disabled={pending} className={styles.submitBtn}>
          {pending ? "Se salvează..." : "Schimbă parola"}
        </button>
      </form>
    </div>
  )
}
