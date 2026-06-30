"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { saveIntakeFormAction, type IIntakeFormData } from "@/app/actions/clientProfile"
import type { IScanResult } from "@/app/api/ai/intake/scan/route"
import styles from "./IntakeForm.module.scss"

interface IIntakeFormProps {
  onClose: () => void
}

const GOALS = [
  { value: "fitness general", label: "Fitness general" },
  { value: "slăbit", label: "Slăbit" },
  { value: "masă musculară", label: "Masă musculară" },
  { value: "rezistență", label: "Rezistență" },
  { value: "mobilitate", label: "Mobilitate" },
  { value: "recuperare", label: "Recuperare după accidentare" },
]

const LEVELS = [
  { value: "începător", label: "Începător — prima dată la sală" },
  { value: "intermediar", label: "Intermediar — am mai făcut sport" },
  { value: "avansat", label: "Avansat — antrenament regulat" },
]

const HOURS = [
  { value: "dimineață", label: "Dimineață (06:00–12:00)" },
  { value: "prânz", label: "Prânz (12:00–16:00)" },
  { value: "seară", label: "Seară (16:00–22:00)" },
  { value: "flexibil", label: "Flexibil" },
]

const EMPTY: IIntakeFormData = {
  reason: "",
  fitnessGoal: "",
  experienceLevel: "",
  daysPerWeek: 3,
  preferredHours: "",
  injuries: "",
  medicalRestrictions: "",
}

type ScanState = "idle" | "scanning" | "done" | "error"

export default function IntakeForm({ onClose }: IIntakeFormProps) {
  const [data, setData] = useState<IIntakeFormData>(EMPTY)
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [scanError, setScanError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function keyHandler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", keyHandler)
    return () => document.removeEventListener("keydown", keyHandler)
  }, [onClose])

  function set<K extends keyof IIntakeFormData>(key: K, value: IIntakeFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  async function scanFile(file: File) {
    setScanState("scanning")
    setScanError("")

    const form = new FormData()
    form.append("file", file)

    try {
      const res = await fetch("/api/ai/intake/scan", { method: "POST", body: form })
      const json = await res.json() as IScanResult & { error?: string }

      if (!res.ok || json.error) {
        setScanError(json.error ?? "Eroare la analiză.")
        setScanState("error")
        return
      }

      setData((prev) => ({
        ...prev,
        injuries: json.injuries ? (prev.injuries ? `${prev.injuries}\n${json.injuries}` : json.injuries) : prev.injuries,
        medicalRestrictions: json.medicalRestrictions
          ? (prev.medicalRestrictions ? `${prev.medicalRestrictions}\n${json.medicalRestrictions}` : json.medicalRestrictions)
          : prev.medicalRestrictions,
      }))
      setScanState("done")
    } catch {
      setScanError("Eroare de rețea. Încearcă din nou.")
      setScanState("error")
    }
  }

  function filePickHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) scanFile(file)
    e.target.value = ""
  }

  function dropHandler(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) scanFile(file)
  }

  function submitHandler(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await saveIntakeFormAction(data)
      setDone(true)
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>AF</div>
            <div className={styles.headerInfo}>
              <span className={styles.headerName}>Fișa de client</span>
              <span className={styles.headerSub}>Completează câmpurile de mai jos</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Închide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>Fișa a fost salvată!</h3>
            <p className={styles.successSub}>Antrenorul tău o va putea consulta înainte de prima ședință.</p>
            <button className={styles.doneBtn} onClick={onClose}>Intră în cont</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.scroll}>
              <div className={styles.field}>
                <label className={styles.label}>De ce ai venit la sală? <span className={styles.req}>*</span></label>
                <textarea
                  className={styles.textarea}
                  placeholder="Ex: vreau să slăbesc, să mă mișc mai mult, recuperare după operație..."
                  value={data.reason}
                  rows={2}
                  required
                  onChange={(e) => set("reason", e.target.value)}
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Obiectiv principal <span className={styles.req}>*</span></label>
                  <select
                    className={styles.select}
                    value={data.fitnessGoal}
                    required
                    onChange={(e) => set("fitnessGoal", e.target.value)}
                  >
                    <option value="">Alege...</option>
                    {GOALS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Nivel experiență <span className={styles.req}>*</span></label>
                  <select
                    className={styles.select}
                    value={data.experienceLevel}
                    required
                    onChange={(e) => set("experienceLevel", e.target.value)}
                  >
                    <option value="">Alege...</option>
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Zile/săptămână</label>
                  <div className={styles.daysRow}>
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`${styles.dayBtn} ${data.daysPerWeek === d ? styles.dayBtnActive : ""}`}
                        onClick={() => set("daysPerWeek", d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Ore preferate</label>
                  <select
                    className={styles.select}
                    value={data.preferredHours}
                    onChange={(e) => set("preferredHours", e.target.value)}
                  >
                    <option value="">Alege...</option>
                    {HOURS.map((h) => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Document scan */}
              <div className={styles.divider}>
                <span>Informații medicale (opțional)</span>
              </div>

              <div
                className={`${styles.scanZone} ${dragOver ? styles.scanZoneDrag : ""} ${scanState === "done" ? styles.scanZoneDone : ""} ${scanState === "error" ? styles.scanZoneError : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={dropHandler}
                onClick={() => scanState !== "scanning" && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className={styles.fileInput}
                  accept="image/*,.pdf"
                  onChange={filePickHandler}
                />

                {scanState === "scanning" ? (
                  <>
                    <div className={styles.scanSpinner} />
                    <span className={styles.scanText}>AI analizează documentul...</span>
                  </>
                ) : scanState === "done" ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className={styles.scanText}>Document analizat — câmpurile au fost completate</span>
                    <span className={styles.scanRescan} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                      Înlocuiește
                    </span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div className={styles.scanTextWrap}>
                      <span className={styles.scanText}>
                        {scanState === "error" ? scanError : "Importă document medical"}
                      </span>
                      <span className={styles.scanSub}>Poză, scan sau PDF — AI extrage automat informațiile</span>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Accidentări sau probleme fizice</label>
                <textarea
                  className={`${styles.textarea} ${styles.textareaMedical}`}
                  placeholder="Ex: genunchi operat, spate dureros, umăr luxat..."
                  value={data.injuries}
                  rows={2}
                  onChange={(e) => set("injuries", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Restricții fizice</label>
                <textarea
                  className={`${styles.textarea} ${styles.textareaMedical}`}
                  placeholder="Ex: nu pot face sărituri, evit genuflexiunile adânci..."
                  value={data.medicalRestrictions}
                  rows={2}
                  onChange={(e) => set("medicalRestrictions", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <p className={styles.hint}>Informațiile sunt confidențiale și vizibile doar antrenorului tău</p>
              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? "Se salvează..." : "Salvează fișa"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
