"use client"

import React, { useState } from "react"
import Link from "next/link"
import styles from "./ForgotPasswordForm.module.scss"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "A apărut o eroare. Încearcă din nou.")
      } else {
        setSuccess(true)
      }
    } catch {
      setError("A apărut o eroare. Încearcă din nou.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ai uitat parola?</h1>
      <p className={styles.subtitle}>
        Introdu emailul contului și îți trimitem un link de resetare.
      </p>

      {success ? (
        <div className={styles.successMessage}>
          <p>
            Dacă există un cont cu acest email, vei primi un link de resetare în câteva minute.
          </p>
        </div>
      ) : (
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@exemplu.ro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={pending} className={styles.submitBtn}>
            {pending ? "Se trimite..." : "Trimite link de resetare"}
          </button>
        </form>
      )}

      <p className={styles.backLink}>
        <Link href="/login">← Înapoi la login</Link>
      </p>
    </div>
  )
}
