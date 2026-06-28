"use client"

import React, { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import Link from "next/link"
import { registerUser } from "@/app/actions/auth"
import OAuthButtons from "@/components/auth/oauthButtons/OAuthButtons"
import styles from "./RegisterForm.module.scss"

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending || disabled} className={styles.submitBtn}>
      {pending ? "Se creează contul..." : "Creează cont"}
    </button>
  )
}

function validateName(v: string) {
  if (!v.trim()) return "Numele este obligatoriu"
  if (v.trim().length < 2) return "Minim 2 caractere"
  if (v.trim().length > 50) return "Maxim 50 caractere"
  return ""
}
function validateEmail(v: string) {
  if (!v) return "Email-ul este obligatoriu"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Format email invalid"
  return ""
}
function validatePassword(v: string) {
  if (!v) return "Parola este obligatorie"
  if (v.length < 8) return "Minim 8 caractere"
  return ""
}
function validateConfirm(v: string, pw: string) {
  if (!v) return "Confirmă parola"
  if (v !== pw) return "Parolele nu coincid"
  return ""
}

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerUser, { error: null, success: false })
  const [pwValue, setPwValue] = useState("")
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" })

  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Creează cont</h1>
      <p className={styles.subtitle}>Alătură-te comunității ApexFit</p>

      {state.success ? (
        <div className={styles.successMessage}>
          <p>✓ Contul a fost creat! Verifică-ți emailul pentru a confirma adresa.</p>
        </div>
      ) : (
        <form action={formAction} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Nume complet</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Ion Popescu"
              className={errors.name ? styles.inputError : ""}
              onBlur={(e) => setErrors((p) => ({ ...p, name: validateName(e.target.value) }))}
              onChange={() => setErrors((p) => ({ ...p, name: "" }))}
            />
            {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="email@exemplu.ro"
              className={errors.email ? styles.inputError : ""}
              onBlur={(e) => setErrors((p) => ({ ...p, email: validateEmail(e.target.value) }))}
              onChange={() => setErrors((p) => ({ ...p, email: "" }))}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Parolă</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Minim 8 caractere"
              className={errors.password ? styles.inputError : ""}
              onChange={(e) => { setPwValue(e.target.value); setErrors((p) => ({ ...p, password: "" })) }}
              onBlur={(e) => setErrors((p) => ({ ...p, password: validatePassword(e.target.value) }))}
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirmă parola</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              className={errors.confirmPassword ? styles.inputError : ""}
              onBlur={(e) => setErrors((p) => ({ ...p, confirmPassword: validateConfirm(e.target.value, pwValue) }))}
              onChange={() => setErrors((p) => ({ ...p, confirmPassword: "" }))}
            />
            {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
          </div>

          {state.error && (
            <p className={styles.error} role="alert">{state.error}</p>
          )}

          <SubmitButton disabled={hasErrors} />
        </form>
      )}

      <OAuthButtons />

      <p className={styles.loginLink}>
        Ai deja cont?{" "}
        <Link href="/login">Intră în cont</Link>
      </p>
    </div>
  )
}
