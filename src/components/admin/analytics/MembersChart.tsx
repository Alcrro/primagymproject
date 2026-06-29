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
import { IMembersDataPoint } from "@/types/adminAnalytics"
import styles from "./MembersChart.module.scss"

interface IMembersChartProps {
  data: IMembersDataPoint[]
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
      <p className={styles.tooltipValue}>{payload[0].value} membri noi</p>
    </div>
  )
}

export default function MembersChart({ data }: IMembersChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-people" />
        <p>Nu există membri noi înregistrați în această perioadă.</p>
      </div>
    )
  }

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-muted)" strokeOpacity={0.2} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="newMembers" fill="#FF5C00" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
