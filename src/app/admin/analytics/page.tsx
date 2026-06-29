import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"
import styles from "./analytics.module.scss"
import PeriodFilter from "@/components/admin/analytics/PeriodFilter"
import KpiCards from "@/components/admin/analytics/KpiCards"
import RevenueChart from "@/components/admin/analytics/RevenueChart"
import SubscriptionByCategoryChart from "@/components/admin/analytics/SubscriptionByCategoryChart"
import PeakHoursChart from "@/components/admin/analytics/PeakHoursChart"
import TopTrainersTable from "@/components/admin/analytics/TopTrainersTable"
import MembersChart from "@/components/admin/analytics/MembersChart"
import CsvExportButton from "@/components/admin/analytics/CsvExportButton"
import type {
  IRevenueDataPoint,
  ISubscriptionByCategory,
  IPeakHourDataPoint,
  ITopTrainer,
  IMembersDataPoint,
  IKpiData,
} from "@/types/adminAnalytics"

interface IAnalyticsPageProps {
  searchParams: { from?: string; to?: string }
}

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}

export default async function AnalyticsPage({ searchParams }: IAnalyticsPageProps) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/admin")

  const now = new Date()

  const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const defaultTo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  const fromParam = searchParams.from
  const toParam = searchParams.to

  const from = fromParam ? new Date(`${fromParam}T00:00:00`) : defaultFrom
  const to = toParam ? new Date(`${toParam}T23:59:59`) : defaultTo

  const fromStr = toDateString(from)
  const toStr = toDateString(to)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  type RevenueRow = { date: string; revenue: number }
  type CategoryRow = { category: string; count: number }
  type PeakHourRow = { hour: number; checkIns: number }
  type TrainerRow = { trainerId: number; name: string; bookings: number }
  type MembersRow = { week: string; newMembers: number }

  const [
    revenueRows,
    categoryRows,
    peakHourRows,
    trainerRows,
    membersRows,
    mrrResult,
    activeMembersData,
    currentBuyers,
    prevBuyers,
    confirmedBookings,
    checkInUsersData,
  ] = await Promise.all([
    prisma.$queryRaw<RevenueRow[]>(Prisma.sql`
      SELECT DATE("createdAt")::text as date, SUM("totalRon")::float as revenue
      FROM "Order"
      WHERE status = 'PAID' AND "createdAt" >= ${from} AND "createdAt" <= ${to}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt")
    `),
    prisma.$queryRaw<CategoryRow[]>(Prisma.sql`
      SELECT oi."categoryName" as category, COUNT(*)::int as count
      FROM "OrderItem" oi
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o.status = 'PAID' AND o."createdAt" >= ${from} AND o."createdAt" <= ${to}
      GROUP BY oi."categoryName"
      ORDER BY count DESC
    `),
    prisma.$queryRaw<PeakHourRow[]>(Prisma.sql`
      SELECT EXTRACT(HOUR FROM "scannedAt")::int as hour, COUNT(*)::int as "checkIns"
      FROM "CheckIn"
      WHERE "scannedAt" >= ${from} AND "scannedAt" <= ${to}
      GROUP BY EXTRACT(HOUR FROM "scannedAt")
      ORDER BY hour
    `),
    prisma.$queryRaw<TrainerRow[]>(Prisma.sql`
      SELECT t.id::int as "trainerId", t.name, COUNT(cb.id)::int as bookings
      FROM "ClassBooking" cb
      JOIN "ClassSession" cs ON cb."sessionId" = cs.id
      JOIN "Trainer" t ON cs."trainerId" = t.id
      WHERE cb.status = 'CONFIRMED' AND cs."startAt" >= ${from} AND cs."startAt" <= ${to}
      GROUP BY t.id, t.name
      ORDER BY bookings DESC
      LIMIT 10
    `),
    prisma.$queryRaw<MembersRow[]>(Prisma.sql`
      SELECT TO_CHAR(DATE_TRUNC('week', "createdAt"), 'YYYY-"W"IW') as week, COUNT(*)::int as "newMembers"
      FROM "User"
      WHERE role = 'MEMBER' AND "createdAt" >= ${from} AND "createdAt" <= ${to}
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY DATE_TRUNC('week', "createdAt")
    `),
    prisma.order.aggregate({
      where: { status: "PAID", createdAt: { gte: startOfMonth } },
      _sum: { totalRon: true },
    }),
    prisma.checkIn.findMany({
      where: { scannedAt: { gte: from, lte: to } },
      distinct: ["userId"],
      select: { userId: true },
    }),
    prisma.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: from, lte: to },
        userId: { not: null },
      },
      select: { userId: true },
      distinct: ["userId"],
    }),
    (async () => {
      const periodDays = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
      const prevFrom = new Date(from.getTime() - periodDays * 24 * 60 * 60 * 1000)
      const prevTo = new Date(from)
      return prisma.order.findMany({
        where: {
          status: "PAID",
          createdAt: { gte: prevFrom, lte: prevTo },
          userId: { not: null },
        },
        select: { userId: true },
        distinct: ["userId"],
      })
    })(),
    prisma.classBooking.count({
      where: {
        status: "CONFIRMED",
        session: { startAt: { gte: from, lte: to } },
      },
    }),
    prisma.checkIn.findMany({
      where: { scannedAt: { gte: from, lte: to } },
      distinct: ["userId"],
      select: { userId: true },
    }),
  ])

  const mrr = Number(mrrResult._sum.totalRon ?? 0)
  const activeMembers = activeMembersData.length

  const currentIds = new Set(currentBuyers.map((o) => o.userId!))
  const retained = prevBuyers.filter((o) => currentIds.has(o.userId!)).length
  const retentionRate =
    prevBuyers.length > 0 ? Math.round((retained / prevBuyers.length) * 100) : 0

  const checkInUsersCount = checkInUsersData.length
  const noShowRate =
    confirmedBookings > 0
      ? Math.max(0, Math.round(((confirmedBookings - checkInUsersCount) / confirmedBookings) * 100))
      : 0

  const kpi: IKpiData = { mrr, activeMembers, retentionRate, noShowRate }

  const revenueData: IRevenueDataPoint[] = revenueRows
  const categoryData: ISubscriptionByCategory[] = categoryRows
  const peakHourData: IPeakHourDataPoint[] = peakHourRows
  const trainerData: ITopTrainer[] = trainerRows
  const membersData: IMembersDataPoint[] = membersRows

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>
            Perioadă: {fromStr} — {toStr}
          </p>
        </div>
        <CsvExportButton from={fromStr} to={toStr} />
      </div>

      <div className={styles.filterRow}>
        <PeriodFilter currentFrom={fromStr} currentTo={toStr} />
      </div>

      <div className={styles.kpiGrid}>
        <KpiCards kpi={kpi} />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Venituri zilnice (RON)</h2>
          <RevenueChart data={revenueData} />
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Abonamente pe categorie</h2>
          <SubscriptionByCategoryChart data={categoryData} />
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ore de vârf (check-in-uri)</h2>
          <PeakHoursChart data={peakHourData} />
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Membri noi pe săptămână</h2>
          <MembersChart data={membersData} />
        </div>
      </div>

      <div className={styles.fullWidthSection}>
        <h2 className={styles.sectionTitle}>Top antrenori după rezervări</h2>
        <TopTrainersTable data={trainerData} />
      </div>
    </div>
  )
}
