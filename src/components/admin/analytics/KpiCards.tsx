import { IKpiData } from "@/types/adminAnalytics"
import styles from "./KpiCards.module.scss"

interface IKpiCardsProps {
  kpi: IKpiData
}

export default function KpiCards({ kpi }: IKpiCardsProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.label}>MRR</span>
        <span className={styles.value}>
          {kpi.mrr.toLocaleString("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} RON
        </span>
        <span className={styles.desc}>Venituri luna curentă</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Membri activi</span>
        <span className={styles.value}>{kpi.activeMembers}</span>
        <span className={styles.desc}>Cu check-in în perioadă</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Rată retenție</span>
        <span className={styles.value}>{kpi.retentionRate}%</span>
        <span className={styles.desc}>față de perioada anterioară</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>No-show rate</span>
        <span className={styles.value}>{kpi.noShowRate}%</span>
        <span className={styles.desc}>Rezervări fără prezență</span>
      </div>
    </div>
  )
}
