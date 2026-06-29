"use client"

import { ITopTrainer } from "@/types/adminAnalytics"
import styles from "./TopTrainersTable.module.scss"

interface ITopTrainersTableProps {
  data: ITopTrainer[]
}

export default function TopTrainersTable({ data }: ITopTrainersTableProps) {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-person-badge" />
        <p>Nu există date despre antrenori în această perioadă.</p>
      </div>
    )
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Rang</th>
            <th className={styles.th}>Nume</th>
            <th className={styles.th}>Rezervări</th>
          </tr>
        </thead>
        <tbody>
          {data.map((trainer, index) => (
            <tr key={trainer.trainerId} className={styles.row}>
              <td className={styles.tdRank}>
                <span className={`${styles.rank} ${index < 3 ? styles.top : ""}`}>
                  {index + 1}
                </span>
              </td>
              <td className={styles.td}>{trainer.name}</td>
              <td className={styles.tdBookings}>{trainer.bookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
