"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { IRevenueDataPoint } from "@/types/adminAnalytics"
import styles from "./RevenueChart.module.scss"

interface IRevenueChartProps {
  data: IRevenueDataPoint[]
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("ro-RO", { day: "numeric", month: "short" })
}

interface ITooltipPayloadEntry {
  value: number
}

interface ICustomTooltipProps {
  active?: boolean
  payload?: ITooltipPayloadEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: ICustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        {payload[0].value.toFixed(2)} RON
      </p>
    </div>
  )
}

export default function RevenueChart({ data }: IRevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-bar-chart" />
        <p>Nu există date de venituri în această perioadă.</p>
      </div>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDateLabel(d.date),
  }))

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" strokeOpacity={0.2} />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#FF5C00"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#FF5C00" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
