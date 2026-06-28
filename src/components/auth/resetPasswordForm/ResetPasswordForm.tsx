"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./ResetPasswordForm.module.scss"

interface IResetPasswordFormProps {
  token: string
}

export default function ResetPasswordForm({ token }: IResetPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Parolele nu coincid")
      return
    }

    setPending(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "A apărut o eroare. Încearcă din nou.")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 2500)
      }
    } catch {
      setError("A apărut o eroare. Încearcă din nou.")
    } finally {
      setPending(false)
    }
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Link invalid. Solicită un nou link de resetare.</p>
        <Link href="/forgot-password" className={styles.backLink}>
          Solicită link nou
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Parolă nouă</h1>
      <p className={styles.subtitle}>Setează o nouă parolă pentru contul tău.</p>

      {success ? (
        <div className={styles.successMessage}>
          <p>Parola a fost schimbată cu succes! Te redirecționăm la login...</p>
        </div>
      ) : (
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="password">Parolă nouă</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Minim 8 caractere"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirmă parola</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={pending} className={styles.submitBtn}>
            {pending ? "Se salvează..." : "Salvează parola nouă"}
          </button>
        </form>
      )}
    </div>
  )
}
