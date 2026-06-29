"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { inviteEmployee } from "@/app/actions/corporate"
import styles from "./InviteEmployeeButton.module.scss"

interface InviteEmployeeButtonProps {
  corporateAccountId: string
}

export default function InviteEmployeeButton({ corporateAccountId }: InviteEmployeeButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  function closeHandler() {
    setOpen(false)
    setEmail("")
    setError(null)
    setSuccess(null)
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await inviteEmployee(corporateAccountId, email)
      setSuccess(`Invitația a fost trimisă la ${email}`)
      setEmail("")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "A apărut o eroare")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className={styles.btn} onClick={() => setOpen(true)}>
        <i className="bi bi-plus-lg" />
        Invită angajat
      </button>

      {open && (
        <div className={styles.overlay} onClick={closeHandler}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalTitle}>Invită angajat</p>
            <form onSubmit={submitHandler}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="invite-email">
                  Email angajat
                </label>
                <input
                  id="invite-email"
                  className={styles.input}
                  type="email"
                  required
                  placeholder="angajat@companie.ro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
              <div className={styles.actions}>
                <button type="button" className={styles.btnCancel} onClick={closeHandler}>
                  Închide
                </button>
                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                  {loading ? "Se trimite..." : "Trimite invitație"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
