"use client"

import { useState } from "react"
import type { ClientProfile } from "@prisma/client"
import AiIntakeModal from "@/components/ai/AiIntakeModal"
import IntakeForm from "@/components/ai/IntakeForm"
import { saveCommunicationStyleAction } from "@/app/actions/clientProfile"
import styles from "./FisaClientPage.module.scss"

interface IFisaClientPageProps {
  profile: ClientProfile | null
  hasAI: boolean
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

const COMMUNICATION_STYLES = [
  {
    value: "prietenos",
    label: "Prietenos",
    desc: "Ton cald și accesibil, conversație naturală",
    icon: "🤝",
  },
  {
    value: "direct",
    label: "Direct",
    desc: "Scurt și la obiect, fără digresiuni",
    icon: "⚡",
  },
  {
    value: "motivational",
    label: "Motivațional",
    desc: "Energic, încurajator, orientat spre acțiune",
    icon: "💪",
  },
  {
    value: "tehnic",
    label: "Tehnic",
    desc: "Detaliat, cu explicații aprofundate",
    icon: "🧪",
  },
]

interface IDataCardProps {
  icon: React.ReactNode
  label: string
  value: string | null | undefined
}

function DataCard({ icon, label, value }: IDataCardProps) {
  if (!value) return null
  return (
    <div className={styles.dataCard}>
      <div className={styles.dataIcon}>{icon}</div>
      <div className={styles.dataContent}>
        <span className={styles.dataLabel}>{label}</span>
        <span className={styles.dataValue}>{value}</span>
      </div>
    </div>
  )
}

export default function FisaClientPage({ profile, hasAI }: IFisaClientPageProps) {
  const [open, setOpen] = useState(false)
  const [commStyle, setCommStyle] = useState<string>(profile?.communicationStyle ?? "prietenos")
  const [styleSaved, setStyleSaved] = useState(false)

  async function styleClickHandler(value: string) {
    if (value === commStyle) return
    setCommStyle(value)
    setStyleSaved(false)
    await saveCommunicationStyleAction(value)
    setStyleSaved(true)
    setTimeout(() => setStyleSaved(false), 2000)
  }

  function closeHandler() {
    setOpen(false)
    window.location.reload()
  }

  if (!profile) {
    return (
      <div className={styles.wrap}>
        <div className={styles.emptyCard}>
          <div className={styles.emptyIllustration}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>Nu ai completat fișa medicală</h2>
          <p className={styles.emptySub}>
            Un scurt chat cu AI-ul nostru ne ajută să înțelegem mai bine nevoile tale — antrenorul va putea consulta fișa înainte de prima ședință.
          </p>
          <button className={styles.startBtn} onClick={() => setOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Completează fișa acum
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.styleHeader}>
            <h2 className={styles.sectionTitle}>Cum preferi să comunic cu tine?</h2>
            {styleSaved && <span className={styles.styleSaved}>✓ Salvat</span>}
          </div>
          <p className={styles.styleDesc}>Toate interacțiunile AI vor folosi stilul ales.</p>
          <div className={styles.styleGrid}>
            {COMMUNICATION_STYLES.map((s) => (
              <button
                key={s.value}
                className={`${styles.styleCard} ${commStyle === s.value ? styles.styleCardActive : ""}`}
                onClick={() => styleClickHandler(s.value)}
              >
                <span className={styles.styleEmoji}>{s.icon}</span>
                <span className={styles.styleLabel}>{s.label}</span>
                <span className={styles.styleCardDesc}>{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {open && (hasAI
          ? <AiIntakeModal onClose={closeHandler} />
          : <IntakeForm onClose={closeHandler} />
        )}
      </div>
    )
  }

  const completedDate = new Date(profile.completedAt).toLocaleDateString("ro-RO", {
    day: "numeric", month: "long", year: "numeric",
  })

  const fitnessGoalDisplay = profile.fitnessGoal
    ? (GOAL_LABELS[profile.fitnessGoal.toLowerCase()] ?? profile.fitnessGoal)
    : null
  const levelDisplay = profile.experienceLevel
    ? (LEVEL_LABELS[profile.experienceLevel.toLowerCase()] ?? profile.experienceLevel)
    : null

  const hasInjuries = profile.injuries || profile.medicalRestrictions

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Fișa mea</h1>
          <p className={styles.pageDate}>Completată pe {completedDate}</p>
        </div>
        <button className={styles.updateBtn} onClick={() => setOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Actualizează
        </button>
      </div>

      {/* AI Summary */}
      {profile.aiSummary && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <div className={styles.summaryBadge}>AI</div>
            <span className={styles.summaryTitle}>Rezumatul asistentului</span>
          </div>
          <p className={styles.summaryText}>{profile.aiSummary}</p>
        </div>
      )}

      {/* Trainer note */}
      {profile.trainerNotes && (
        <div className={styles.trainerCard}>
          <div className={styles.trainerHeader}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className={styles.trainerTitle}>Nota antrenorului</span>
          </div>
          <p className={styles.trainerText}>{profile.trainerNotes}</p>
        </div>
      )}

      {/* Data grid */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Informații colectate</h2>
        <div className={styles.dataGrid}>
          <DataCard
            label="Motiv vizită"
            value={profile.reason}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
          />
          <DataCard
            label="Obiectiv principal"
            value={fitnessGoalDisplay}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
              </svg>
            }
          />
          <DataCard
            label="Nivel experiență"
            value={levelDisplay}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            }
          />
          <DataCard
            label="Zile pe săptămână"
            value={profile.daysPerWeek ? `${profile.daysPerWeek} zile` : null}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          />
          <DataCard
            label="Ore preferate"
            value={profile.preferredHours}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Medical */}
      {hasInjuries && (
        <div className={styles.medicalSection}>
          <div className={styles.medicalHeader}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h2 className={styles.sectionTitle}>Informații medicale</h2>
          </div>
          <div className={styles.medicalCards}>
            {profile.injuries && (
              <div className={styles.medicalCard}>
                <span className={styles.medicalLabel}>Accidentări / recuperare</span>
                <p className={styles.medicalValue}>{profile.injuries}</p>
              </div>
            )}
            {profile.medicalRestrictions && (
              <div className={styles.medicalCard}>
                <span className={styles.medicalLabel}>Restricții fizice</span>
                <p className={styles.medicalValue}>{profile.medicalRestrictions}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Communication style picker */}
      <div className={styles.section}>
        <div className={styles.styleHeader}>
          <h2 className={styles.sectionTitle}>Cum preferi să comunic cu tine?</h2>
          {styleSaved && <span className={styles.styleSaved}>✓ Salvat</span>}
        </div>
        <p className={styles.styleDesc}>Toate interacțiunile AI (chatbot, fișă, recomandări) vor folosi stilul ales.</p>
        <div className={styles.styleGrid}>
          {COMMUNICATION_STYLES.map((s) => (
            <button
              key={s.value}
              className={`${styles.styleCard} ${commStyle === s.value ? styles.styleCardActive : ""}`}
              onClick={() => styleClickHandler(s.value)}
            >
              <span className={styles.styleEmoji}>{s.icon}</span>
              <span className={styles.styleLabel}>{s.label}</span>
              <span className={styles.styleCardDesc}>{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {open && (hasAI
        ? <AiIntakeModal onClose={closeHandler} />
        : <IntakeForm onClose={closeHandler} />
      )}
    </div>
  )
}
