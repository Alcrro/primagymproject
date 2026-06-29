"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./PeriodFilter.module.scss"

interface IPeriodFilterProps {
  currentFrom: string
  currentTo: string
}

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}

export default function PeriodFilter({ currentFrom, currentTo }: IPeriodFilterProps) {
  const router = useRouter()
  const [fromValue, setFromValue] = useState(currentFrom)
  const [toValue, setToValue] = useState(currentTo)

  const today = new Date()
  const preset7From = toDateString(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000))
  const preset30From = toDateString(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000))
  const preset90From = toDateString(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000))
  const todayStr = toDateString(today)

  function applyPresetHandler(from: string, to: string) {
    router.push(`/admin/analytics?from=${from}&to=${to}`)
  }

  function applyCustomHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!fromValue || !toValue) return
    router.push(`/admin/analytics?from=${fromValue}&to=${toValue}`)
  }

  const isPreset7 = currentFrom === preset7From && currentTo === todayStr
  const isPreset30 = currentFrom === preset30From && currentTo === todayStr
  const isPreset90 = currentFrom === preset90From && currentTo === todayStr

  return (
    <div className={styles.wrapper}>
      <div className={styles.presets}>
        <button
          className={`${styles.presetBtn} ${isPreset7 ? styles.active : ""}`}
          onClick={() => applyPresetHandler(preset7From, todayStr)}
        >
          7 zile
        </button>
        <button
          className={`${styles.presetBtn} ${isPreset30 ? styles.active : ""}`}
          onClick={() => applyPresetHandler(preset30From, todayStr)}
        >
          30 zile
        </button>
        <button
          className={`${styles.presetBtn} ${isPreset90 ? styles.active : ""}`}
          onClick={() => applyPresetHandler(preset90From, todayStr)}
        >
          3 luni
        </button>
      </div>

      <form className={styles.customForm} onSubmit={applyCustomHandler}>
        <input
          type="date"
          className={styles.dateInput}
          value={fromValue}
          onChange={(e) => setFromValue(e.target.value)}
          max={toValue || todayStr}
        />
        <span className={styles.separator}>—</span>
        <input
          type="date"
          className={styles.dateInput}
          value={toValue}
          onChange={(e) => setToValue(e.target.value)}
          min={fromValue}
          max={todayStr}
        />
        <button type="submit" className={styles.applyBtn}>
          Aplică
        </button>
      </form>
    </div>
  )
}
