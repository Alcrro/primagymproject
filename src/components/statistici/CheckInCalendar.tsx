import styles from "./CheckInCalendar.module.scss"
import type { ICalendarDay } from "@/types/statistici"

const DOW_LABELS = ["L", "Ma", "Mi", "J", "V", "S", "D"]

function fmtDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("ro-RO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

export default function CheckInCalendar({ data }: { data: ICalendarDay[] }) {
  if (data.length === 0) return null

  const firstDate = new Date(data[0].date + "T12:00:00Z")
  const firstDOW = (firstDate.getDay() + 6) % 7 // Mon=0 ... Sun=6
  const totalCols = Math.ceil((firstDOW + data.length) / 7)
  const weekLabels = Array.from({ length: totalCols }, (_, i) => `S${i + 1}`)

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.dowLabels}>
          {DOW_LABELS.map((d) => (
            <span key={d} className={styles.dowLabel}>{d}</span>
          ))}
        </div>

        <div className={styles.colsWrapper}>
          <div className={styles.weekLabels}>
            {weekLabels.map((w, i) => (
              <span key={i} className={styles.weekLabel}>{w}</span>
            ))}
          </div>
          <div className={styles.grid}>
            {Array.from({ length: firstDOW }).map((_, i) => (
              <div key={`pad-${i}`} className={styles.cellPad} />
            ))}
            {data.map((day) => (
              <div
                key={day.date}
                className={`${styles.cell} ${
                  day.isFuture
                    ? styles.future
                    : day.count > 0
                      ? styles.active
                      : styles.inactive
                }`}
                title={
                  day.isFuture
                    ? `${fmtDate(day.date)} — abonament activ`
                    : `${fmtDate(day.date)}${day.count > 0 ? " — check-in" : ""}`
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Mai puțin</span>
        <div className={`${styles.legendCell} ${styles.inactive}`} />
        <div className={`${styles.legendCell} ${styles.active}`} />
        <span className={styles.legendLabel}>Mai mult</span>
        {data.some((d) => d.isFuture) && (
          <>
            <span className={styles.legendSep} />
            <div className={`${styles.legendCell} ${styles.future}`} />
            <span className={styles.legendLabel}>Abonament activ</span>
          </>
        )}
      </div>
    </div>
  )
}
