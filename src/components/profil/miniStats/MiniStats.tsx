import styles from "./MiniStats.module.scss"

interface IMiniStatsProps {
  streakDays: number
  checkInsThisMonth: number
}

export default function MiniStats({ streakDays, checkInsThisMonth }: IMiniStatsProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.icon}>🔥</span>
        <div>
          <p className={styles.value}>{streakDays}</p>
          <p className={styles.label}>{streakDays === 1 ? "zi consecutivă" : "zile consecutive"}</p>
        </div>
      </div>
      <div className={styles.card}>
        <span className={styles.icon}>📅</span>
        <div>
          <p className={styles.value}>{checkInsThisMonth}</p>
          <p className={styles.label}>{checkInsThisMonth === 1 ? "vizită luna aceasta" : "vizite luna aceasta"}</p>
        </div>
      </div>
    </div>
  )
}
