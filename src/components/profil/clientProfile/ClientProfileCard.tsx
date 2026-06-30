import type { ClientProfile } from "@prisma/client"
import styles from "./ClientProfileCard.module.scss"

interface IClientProfileCardProps {
  profile: ClientProfile
  isTrainerView?: boolean
}

const GOAL_LABELS: Record<string, string> = {
  slăbit: "Slăbit",
  "masă musculară": "Masă musculară",
  rezistență: "Rezistență",
  mobilitate: "Mobilitate",
  recuperare: "Recuperare",
  "fitness general": "Fitness general",
}

const LEVEL_LABELS: Record<string, string> = {
  începător: "Începător",
  intermediar: "Intermediar",
  avansat: "Avansat",
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  )
}

export default function ClientProfileCard({ profile, isTrainerView = false }: IClientProfileCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3 className={styles.cardTitle}>Fișa clientului</h3>
        <span className={styles.cardDate}>
          {new Date(profile.completedAt).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {isTrainerView && profile.aiSummary && (
        <div className={styles.summary}>
          <span className={styles.summaryLabel}>Rezumat AI</span>
          <p className={styles.summaryText}>{profile.aiSummary}</p>
        </div>
      )}

      <div className={styles.fields}>
        <Field label="Motiv vizită" value={profile.reason} />
        <Field
          label="Obiectiv principal"
          value={profile.fitnessGoal ? (GOAL_LABELS[profile.fitnessGoal.toLowerCase()] ?? profile.fitnessGoal) : null}
        />
        <Field
          label="Nivel experiență"
          value={profile.experienceLevel ? (LEVEL_LABELS[profile.experienceLevel.toLowerCase()] ?? profile.experienceLevel) : null}
        />
        <Field label="Zile/săptămână" value={profile.daysPerWeek ? `${profile.daysPerWeek} zile` : null} />
        <Field label="Ore preferate" value={profile.preferredHours} />
      </div>

      {(profile.injuries || profile.medicalRestrictions) && (
        <div className={styles.medicalSection}>
          <div className={styles.medicalHeader}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Informații medicale</span>
          </div>
          {profile.injuries && (
            <div className={styles.medicalField}>
              <span className={styles.fieldLabel}>Accidentări / recuperare</span>
              <span className={styles.fieldValue}>{profile.injuries}</span>
            </div>
          )}
          {profile.medicalRestrictions && (
            <div className={styles.medicalField}>
              <span className={styles.fieldLabel}>Restricții</span>
              <span className={styles.fieldValue}>{profile.medicalRestrictions}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
