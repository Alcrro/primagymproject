"use client"

import { useState, useTransition } from "react"
import { resendVerificationEmailAction } from "@/app/actions/auth"
import styles from "./ProfilHeader.module.scss"

export default function ResendVerificationButton() {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  function handleResend() {
    startTransition(async () => {
      await resendVerificationEmailAction()
      setSent(true)
    })
  }

  if (sent) {
    return <span className={styles.resendDone}>Email trimis! Verifică-ți căsuța.</span>
  }

  return (
    <button onClick={handleResend} disabled={isPending} className={styles.resendBtn}>
      {isPending ? "Se trimite..." : "Retrimite email"}
    </button>
  )
}
