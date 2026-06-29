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
import { IPeakHourDataPoint } from "@/types/adminAnalytics"
import styles from "./PeakHoursChart.module.scss"

interface IPeakHoursChartProps {
  data: IPeakHourDataPoint[]
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
      <p className={styles.tooltipLabel}>{label}:00</p>
      <p className={styles.tooltipValue}>{payload[0].value} check-in-uri</p>
    </div>
  )
}

export default function PeakHoursChart({ data }: IPeakHoursChartProps) {
  const allHours: IPeakHourDataPoint[] = Array.from({ length: 24 }, (_, i) => {
    const found = data.find((d) => d.hour === i)
    return { hour: i, checkIns: found ? found.checkIns : 0 }
  })

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={allHours} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-muted)" strokeOpacity={0.2} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(h: number) => `${h}h`}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="checkIns" fill="#FF5C00" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
