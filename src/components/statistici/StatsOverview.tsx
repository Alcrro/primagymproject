import StatsCard from "@/components/statistici/StatsCard"
import CheckInCalendar from "@/components/statistici/CheckInCalendar"
import ActivityChart from "@/components/statistici/ActivityChart"
import type { IStatsOverview } from "@/types/statistici"
import styles from "./StatsOverview.module.scss"

function fmtExpiry(date: Date) {
  return date.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })
}

function entriesCard(stats: IStatsOverview) {
  if (stats.entriesRemaining !== null) {
    return {
      label: "Intrări abonament",
      value: `${stats.entriesRemaining}`,
      sub: `${stats.entriesUsed} consumate`,
      expired: stats.entriesRemaining === 0,
    }
  }
  if (stats.subscriptionExpiresAt) {
    const expired = stats.subscriptionExpiresAt < new Date()
    return {
      label: "Abonament lunar",
      value: expired ? "Expirat" : "Activ",
      sub: `${expired ? "Expirat" : "Valabil"} până la ${fmtExpiry(stats.subscriptionExpiresAt)}`,
      expired,
    }
  }
  return {
    label: "Abonament",
    value: "—",
    sub: "Niciun abonament activ",
    expired: false,
  }
}

export default function StatsOverview({ stats }: { stats: IStatsOverview }) {
  const isEmpty = stats.streakDays === 0 && stats.classesAttended === 0

  if (isEmpty) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🏋️</div>
        <p className={styles.emptyTitle}>Nicio activitate înregistrată</p>
        <p className={styles.emptySub}>
          Primul check-in apare automat după ce scanezi QR-ul la intrare.
        </p>
      </div>
    )
  }

  const entries = entriesCard(stats)

  return (
    <div className={styles.wrapper}>
      <div className={styles.kpiGrid}>
        <StatsCard
          label="Check-in-uri luna aceasta"
          value={stats.checkInsThisMonth}
          sub="față de luna în curs"
        />
        <StatsCard
          label="Streak"
          value={`${stats.streakDays} zile`}
          sub="zile consecutive"
        />
        <StatsCard
          label={entries.label}
          value={entries.value}
          sub={entries.sub}
          expired={entries.expired}
        />
        <StatsCard
          label="Clase frecventate"
          value={stats.classesAttended}
          sub="rezervări confirmate"
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Activitate — ultimele 12 săptămâni</h2>
        <div className={styles.calendarWrap}>
          <CheckInCalendar data={stats.calendarData} />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Check-in-uri lunare</h2>
        <ActivityChart data={stats.monthlyActivity} />
      </div>
    </div>
  )
}
