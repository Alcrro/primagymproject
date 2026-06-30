"use client"

import { useState, useTransition } from "react"
import type { ClientProfile } from "@prisma/client"
import { saveTrainerNotesAction } from "@/app/actions/clientProfile"
import styles from "./TrainerClientView.module.scss"

interface ITrainerClientViewProps {
  profile: ClientProfile
  memberId: string
}

const GOAL_LABELS: Record<string, string> = {
  "slăbit": "Slăbit",
  "masă musculară": "Masă musculară",
  "rezistență": "Rezistență",
  "mobilitate": "Mobilitate",
  "recuperare": "Recuperare",
  "fitness general": "Fitness general",
}

const LEVEL_LABELS: Record<string, string> = {
  "începător": "Începător",
  "intermediar": "Intermediar",
  "avansat": "Avansat",
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  )
}

export default function TrainerClientView({ profile, memberId }: ITrainerClientViewProps) {
  const [notes, setNotes] = useState(profile.trainerNotes ?? "")
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function saveHandler() {
    startTransition(async () => {
      await saveTrainerNotesAction(memberId, notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  const fitnessGoalDisplay = profile.fitnessGoal
    ? (GOAL_LABELS[profile.fitnessGoal.toLowerCase()] ?? profile.fitnessGoal)
    : null
  const levelDisplay = profile.experienceLevel
    ? (LEVEL_LABELS[profile.experienceLevel.toLowerCase()] ?? profile.experienceLevel)
    : null
  const hasInjuries = profile.injuries || profile.medicalRestrictions

  return (
    <div className={styles.wrap}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h3 className={styles.cardTitle}>Fișa clientului</h3>
        <span className={styles.cardDate}>
          {new Date(profile.completedAt).toLocaleDateString("ro-RO", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </span>
      </div>

      {/* AI summary */}
      {profile.aiSummary && (
        <div className={styles.aiSummary}>
          <span className={styles.aiLabel}>AI</span>
          <p className={styles.aiText}>{profile.aiSummary}</p>
        </div>
      )}

      {/* Data rows */}
      <div className={styles.dataSection}>
        <Row label="Motiv vizită" value={profile.reason} />
        <Row label="Obiectiv" value={fitnessGoalDisplay} />
        <Row label="Experiență" value={levelDisplay} />
        <Row label="Zile/săptămână" value={profile.daysPerWeek ? `${profile.daysPerWeek} zile` : null} />
        <Row label="Ore preferate" value={profile.preferredHours} />
      </div>

      {/* Medical */}
      {hasInjuries && (
        <div className={styles.medical}>
          <div className={styles.medicalHeader}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Informații medicale
          </div>
          {profile.injuries && (
            <Row label="Accidentări" value={profile.injuries} />
          )}
          {profile.medicalRestrictions && (
            <Row label="Restricții" value={profile.medicalRestrictions} />
          )}
        </div>
      )}

      {/* Trainer notes */}
      <div className={styles.notesSection}>
        <label className={styles.notesLabel} htmlFor="trainer-notes">
          Nota ta (vizibilă clientului)
        </label>
        <textarea
          id="trainer-notes"
          className={styles.notesTextarea}
          placeholder="Adaugă observații, recomandări sau instrucțiuni pentru client..."
          value={notes}
          rows={4}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          className={styles.saveBtn}
          onClick={saveHandler}
          disabled={isPending}
        >
          {isPending ? "Se salvează..." : saved ? "✓ Salvat" : "Salvează nota"}
        </button>
      </div>
    </div>
  )
}
