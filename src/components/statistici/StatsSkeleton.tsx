import styles from "./StatsSkeleton.module.scss"

export default function StatsSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.kpiGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={`${styles.shimmer} ${styles.labelBar}`} />
            <div className={`${styles.shimmer} ${styles.valueBar}`} />
            <div className={`${styles.shimmer} ${styles.subBar}`} />
          </div>
        ))}
      </div>
      <div className={styles.section}>
        <div className={`${styles.shimmer} ${styles.titleBar}`} />
        <div className={`${styles.shimmer} ${styles.calendarBar}`} />
      </div>
      <div className={styles.section}>
        <div className={`${styles.shimmer} ${styles.titleBar}`} />
        <div className={`${styles.shimmer} ${styles.chartBar}`} />
      </div>
    </div>
  )
}
