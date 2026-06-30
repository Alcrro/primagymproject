"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { inviteEmployee, bulkInviteEmployees } from "@/app/actions/corporate"
import styles from "./InviteEmployeeButton.module.scss"

interface IInviteEmployeeButtonProps {
  corporateAccountId: string
}

interface IEmailRow {
  email: string
  valid: boolean
}

interface IBulkResult {
  email: string
  success: boolean
  error?: string
  devUrl?: string
}

type Tab = "single" | "bulk"
type BulkStep = "upload" | "preview" | "results"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function extractEmailsFromSheet(data: unknown[][]): string[] {
  const found: string[] = []
  for (const row of data) {
    for (const cell of row) {
      const val = String(cell ?? "").trim()
      if (EMAIL_RE.test(val)) found.push(val.toLowerCase())
    }
  }
  return Array.from(new Set(found))
}

export default function InviteEmployeeButton({ corporateAccountId }: IInviteEmployeeButtonProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("single")

  // single
  const [email, setEmail] = useState("")
  const [singleLoading, setSingleLoading] = useState(false)
  const [singleError, setSingleError] = useState<string | null>(null)
  const [singleSuccess, setSingleSuccess] = useState<string | null>(null)

  // bulk
  const [bulkStep, setBulkStep] = useState<BulkStep>("upload")
  const [rows, setRows] = useState<IEmailRow[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkResults, setBulkResults] = useState<IBulkResult[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function closeHandler() {
    setOpen(false)
    setTab("single")
    setEmail("")
    setSingleError(null)
    setSingleSuccess(null)
    setBulkStep("upload")
    setRows([])
    setBulkLoading(false)
    setBulkResults([])
    setParseError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // --- single ---

  async function singleSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSingleError(null)
    setSingleSuccess(null)
    setSingleLoading(true)
    try {
      const result = await inviteEmployee(corporateAccountId, email)
      const devUrl = (result as { devUrl?: string }).devUrl
      setSingleSuccess(devUrl ? `__DEV__${devUrl}` : `Invitația a fost trimisă la ${email}`)
      setEmail("")
      router.refresh()
    } catch (err: unknown) {
      setSingleError(err instanceof Error ? err.message : "A apărut o eroare")
    } finally {
      setSingleLoading(false)
    }
  }

  // --- bulk ---

  async function fileChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setParseError(null)
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { read, utils } = await import("xlsx")
      const buffer = await file.arrayBuffer()
      const wb = read(buffer, { type: "array" })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][]
      const emails = extractEmailsFromSheet(data)

      if (emails.length === 0) {
        setParseError("Nu am găsit niciun email valid în fișier.")
        return
      }

      setRows(emails.map((em) => ({ email: em, valid: EMAIL_RE.test(em) })))
      setBulkStep("preview")
    } catch {
      setParseError("Nu am putut citi fișierul. Asigură-te că e .csv, .xlsx sau .xls.")
    }
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  async function bulkSendHandler() {
    const validEmails = rows.filter((r) => r.valid).map((r) => r.email)
    if (validEmails.length === 0) return

    setBulkLoading(true)
    try {
      const results = await bulkInviteEmployees(corporateAccountId, validEmails)
      setBulkResults(results)
      setBulkStep("results")
      router.refresh()
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "A apărut o eroare")
    } finally {
      setBulkLoading(false)
    }
  }

  function resetBulk() {
    setBulkStep("upload")
    setRows([])
    setBulkResults([])
    setParseError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const validCount = rows.filter((r) => r.valid).length
  const sentCount = bulkResults.filter((r) => r.success).length

  return (
    <>
      <button className={styles.btn} onClick={() => setOpen(true)}>
        <i className="bi bi-plus-lg" />
        Invită angajat
      </button>

      {open && (
        <div className={styles.overlay} onClick={closeHandler}>
          <div
            className={`${styles.modal} ${tab === "bulk" ? styles.modalWide : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${tab === "single" ? styles.tabActive : ""}`}
                onClick={() => setTab("single")}
              >
                Email individual
              </button>
              <button
                className={`${styles.tabBtn} ${tab === "bulk" ? styles.tabActive : ""}`}
                onClick={() => setTab("bulk")}
              >
                Import fișier
              </button>
            </div>

            {tab === "single" && (
              <>
                <p className={styles.modalTitle}>Invită angajat</p>
                <form onSubmit={singleSubmitHandler}>
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
                  {singleError && <p className={styles.error}>{singleError}</p>}
                  {singleSuccess && (
                    singleSuccess.startsWith("__DEV__") ? (
                      <p className={styles.devUrl}>
                        <span>Invitație creată. Link activare (dev):</span>
                        <a href={singleSuccess.replace("__DEV__", "")} target="_blank" rel="noreferrer">
                          Deschide link
                        </a>
                      </p>
                    ) : (
                      <p className={styles.success}>{singleSuccess}</p>
                    )
                  )}
                  <div className={styles.actions}>
                    <button type="button" className={styles.btnCancel} onClick={closeHandler}>
                      Închide
                    </button>
                    <button type="submit" className={styles.btnSubmit} disabled={singleLoading}>
                      {singleLoading ? "Se trimite..." : "Trimite invitație"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {tab === "bulk" && (
              <>
                <p className={styles.modalTitle}>Import listă angajați</p>

                {bulkStep === "upload" && (
                  <>
                    <p className={styles.hint}>
                      Încarcă un fișier .csv, .xlsx sau .xls. Emailurile sunt detectate automat din orice coloană.
                    </p>
                    <label className={styles.dropzone}>
                      <i className="bi bi-upload" />
                      <span>Alege fișier sau trage aici</span>
                      <span className={styles.dropzoneExt}>.csv · .xlsx · .xls</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className={styles.fileInput}
                        onChange={fileChangeHandler}
                      />
                    </label>
                    {parseError && <p className={styles.error}>{parseError}</p>}
                    <div className={styles.actions}>
                      <button type="button" className={styles.btnCancel} onClick={closeHandler}>
                        Anulează
                      </button>
                    </div>
                  </>
                )}

                {bulkStep === "preview" && (
                  <>
                    <p className={styles.hint}>
                      {validCount} emailuri valide din {rows.length} detectate. Poți elimina rânduri înainte de trimitere.
                    </p>
                    {parseError && <p className={styles.error}>{parseError}</p>}
                    <div className={styles.tableWrap}>
                      <table className={styles.previewTable}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, i) => (
                            <tr key={row.email + i}>
                              <td className={styles.muted}>{i + 1}</td>
                              <td>{row.email}</td>
                              <td>
                                {row.valid ? (
                                  <span className={styles.tagOk}>Valid</span>
                                ) : (
                                  <span className={styles.tagErr}>Invalid</span>
                                )}
                              </td>
                              <td>
                                <button
                                  className={styles.removeBtn}
                                  onClick={() => removeRow(i)}
                                  aria-label="Elimină"
                                >
                                  <i className="bi bi-x" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.actions}>
                      <button type="button" className={styles.btnCancel} onClick={resetBulk}>
                        Înapoi
                      </button>
                      <button
                        type="button"
                        className={styles.btnSubmit}
                        disabled={bulkLoading || validCount === 0}
                        onClick={bulkSendHandler}
                      >
                        {bulkLoading ? "Se trimite..." : `Trimite ${validCount} invitații`}
                      </button>
                    </div>
                  </>
                )}

                {bulkStep === "results" && (
                  <>
                    <p className={styles.hint}>
                      {sentCount} din {bulkResults.length} invitații trimise cu succes.
                    </p>
                    <div className={styles.tableWrap}>
                      <table className={styles.previewTable}>
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Rezultat</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bulkResults.map((r) => (
                            <tr key={r.email}>
                              <td>{r.email}</td>
                              <td>
                                {r.success ? (
                                  r.devUrl ? (
                                    <a href={r.devUrl} target="_blank" rel="noreferrer" className={styles.devLink}>
                                      Activează (dev)
                                    </a>
                                  ) : (
                                    <span className={styles.tagOk}>Trimisă</span>
                                  )
                                ) : (
                                  <span className={styles.tagErr}>{r.error}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.actions}>
                      <button type="button" className={styles.btnCancel} onClick={closeHandler}>
                        Închide
                      </button>
                      <button type="button" className={styles.btnSubmit} onClick={resetBulk}>
                        Importă altul
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
