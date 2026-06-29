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
import type { IMonthlyActivity } from "@/types/statistici"
import styles from "./ActivityChart.module.scss"

export default function ActivityChart({ data }: { data: IMonthlyActivity[] }) {
  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.25} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-surface)" }}
            contentStyle={{
              background: "var(--color-card)",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--color-content)",
            }}
            formatter={(value) => [value, "Check-in-uri"]}
          />
          <Bar dataKey="count" fill="#FF5C00" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
