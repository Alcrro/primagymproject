"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ISubscriptionByCategory } from "@/types/adminAnalytics"
import styles from "./SubscriptionByCategoryChart.module.scss"

interface ISubscriptionByCategoryChartProps {
  data: ISubscriptionByCategory[]
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
      <p className={styles.tooltipValue}>{payload[0].value} abonamente</p>
    </div>
  )
}

export default function SubscriptionByCategoryChart({ data }: ISubscriptionByCategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-bar-chart-horizontal" />
        <p>Nu există date de abonamente în această perioadă.</p>
      </div>
    )
  }

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-muted)" strokeOpacity={0.2} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#FF5C00" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
