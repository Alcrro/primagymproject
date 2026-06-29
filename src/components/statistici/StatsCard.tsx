import styles from "./StatsCard.module.scss"

interface IStatsCardProps {
  label: string
  value: string | number
  sub?: string
  expired?: boolean
}

export default function StatsCard({ label, value, sub, expired = false }: IStatsCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={`${styles.value} ${expired ? styles.expired : ""}`}>{value}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  )
}
