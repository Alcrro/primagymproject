"use client"

import React, { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import Link from "next/link"
import { loginWithCredentials } from "@/app/actions/auth"
import OAuthButtons from "@/components/auth/oauthButtons/OAuthButtons"
import styles from "./LoginForm.module.scss"

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending || disabled} className={styles.submitBtn}>
      {pending ? "Se autentifică..." : "Intră în cont"}
    </button>
  )
}

function validateEmail(v: string) {
  if (!v) return "Email-ul este obligatoriu"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Format email invalid"
  return ""
}

interface ILoginFormProps {
  callbackUrl?: string
  oauthError?: string
  verified?: boolean
}

const oauthErrorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "Acest email este asociat unui alt cont. Încearcă cu email/parolă sau alt provider.",
  OAuthSignin: "A apărut o eroare la autentificarea OAuth. Încearcă din nou.",
  Callback: "A apărut o eroare la autentificare. Încearcă din nou.",
}

export default function LoginForm({ callbackUrl, oauthError, verified }: ILoginFormProps) {
  const [state, formAction] = useFormState(loginWithCredentials, { error: null })
  const [emailError, setEmailError] = useState("")

  const hasErrors = Boolean(emailError)
  const oauthMessage = oauthError
    ? (oauthErrorMessages[oauthError] ?? "A apărut o eroare la autentificare. Încearcă din nou.")
    : null

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bun venit înapoi</h1>
      <p className={styles.subtitle}>Intră în contul tău ApexFit</p>

      {verified && (
        <p className={styles.verifiedSuccess}>
          ✓ Adresa de email a fost confirmată! Acum te poți autentifica.
        </p>
      )}

      {oauthMessage && (
        <p className={styles.oauthError} role="alert">{oauthMessage}</p>
      )}

      <form action={formAction} className={styles.form}>
        {callbackUrl && (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        )}

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="email@exemplu.ro"
            className={emailError ? styles.inputError : ""}
            onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            onChange={() => setEmailError("")}
          />
          {emailError && <span className={styles.fieldError}>{emailError}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Parolă</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        <Link href="/forgot-password" className={styles.forgotLink}>
          Ai uitat parola?
        </Link>

        {state.error && (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        )}

        <SubmitButton disabled={hasErrors} />
      </form>

      <OAuthButtons />

      <p className={styles.registerLink}>
        Nu ai cont?{" "}
        <Link href="/register">Înregistrează-te</Link>
      </p>
    </div>
  )
}
