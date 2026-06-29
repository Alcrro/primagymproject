"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCorporateAccount } from "@/app/actions/corporate"
import styles from "./AdminCorporateForm.module.scss"

export default function AdminCorporateForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [hrManagerEmail, setHrManagerEmail] = useState("")
  const [seatsTotal, setSeatsTotal] = useState("")

  function resetForm() {
    setCompanyName("")
    setHrManagerEmail("")
    setSeatsTotal("")
    setError(null)
  }

  function closeHandler() {
    setOpen(false)
    resetForm()
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await createCorporateAccount({
        companyName,
        hrManagerEmail,
        seatsTotal: Number(seatsTotal),
      })
      closeHandler()
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "A apărut o eroare")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className={styles.openBtn} onClick={() => setOpen(true)}>
        <i className="bi bi-plus-lg" />
        Adaugă companie
      </button>

      {open && (
        <div className={styles.overlay} onClick={closeHandler}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalTitle}>Cont corporate nou</p>
            <form onSubmit={submitHandler}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="corp-name">
                  Nume companie
                </label>
                <input
                  id="corp-name"
                  className={styles.input}
                  type="text"
                  required
                  placeholder="Ex: Acme SRL"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="corp-email">
                  Email HR Manager
                </label>
                <input
                  id="corp-email"
                  className={styles.input}
                  type="email"
                  required
                  placeholder="hr@companie.ro"
                  value={hrManagerEmail}
                  onChange={(e) => setHrManagerEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="corp-seats">
                  Număr locuri
                </label>
                <input
                  id="corp-seats"
                  className={styles.input}
                  type="number"
                  required
                  min={1}
                  placeholder="Ex: 20"
                  value={seatsTotal}
                  onChange={(e) => setSeatsTotal(e.target.value)}
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.actions}>
                <button type="button" className={styles.btnCancel} onClick={closeHandler}>
                  Anulează
                </button>
                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                  {loading ? "Se salvează..." : "Creează cont"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
