"use client"

import { useState } from "react"
import styles from "./CsvExportButton.module.scss"

interface ICsvExportButtonProps {
  from: string
  to: string
}

export default function CsvExportButton({ from, to }: ICsvExportButtonProps) {
  const [loading, setLoading] = useState(false)

  async function exportHandler() {
    setLoading(true)
    try {
      const response = await fetch(
        `/admin/analytics/export?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      )
      if (!response.ok) throw new Error("Export eșuat")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const dateStr = new Date().toISOString().split("T")[0]
      a.download = `comenzi-${dateStr}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={styles.btn}
      onClick={exportHandler}
      disabled={loading}
    >
      {loading ? (
        <>
          <i className="bi bi-hourglass-split" />
          <span>Se exportă...</span>
        </>
      ) : (
        <>
          <i className="bi bi-download" />
          <span>Export CSV</span>
        </>
      )}
    </button>
  )
}
