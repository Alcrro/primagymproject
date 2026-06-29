import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import styles from "./admin.module.scss"

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "acum"
  if (mins < 60) return `acum ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `acum ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `acum ${days}z`
}

export default async function AdminPage() {
  const session = await auth()

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalMembers,
    ordersThisMonth,
    checkInsToday,
    upcomingSessions,
    recentCheckIns,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.order.count({ where: { status: "PAID", createdAt: { gte: startOfMonth } } }),
    prisma.checkIn.count({ where: { scannedAt: { gte: startOfDay } } }),
    prisma.classSession.count({ where: { status: "SCHEDULED", startAt: { gte: now } } }),
    prisma.checkIn.findMany({
      take: 6,
      orderBy: { scannedAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.findMany({
      take: 6,
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        items: { take: 1, select: { categoryName: true } },
      },
    }),
  ])

  const dateLabel = now.toLocaleDateString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Bun venit, <strong>{session!.user.name}</strong>
          </p>
        </div>
        <span className={styles.dateChip}>{dateLabel}</span>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <i className="bi bi-people-fill" />
          </div>
          <div className={styles.kpiBody}>
            <span className={styles.kpiValue}>{totalMembers}</span>
            <span className={styles.kpiLabel}>Membri totali</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconGreen}`}>
            <i className="bi bi-bag-fill" />
          </div>
          <div className={styles.kpiBody}>
            <span className={styles.kpiValue}>{ordersThisMonth}</span>
            <span className={styles.kpiLabel}>Comenzi luna aceasta</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconBlue}`}>
            <i className="bi bi-door-open-fill" />
          </div>
          <div className={styles.kpiBody}>
            <span className={styles.kpiValue}>{checkInsToday}</span>
            <span className={styles.kpiLabel}>Check-in-uri azi</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconPurple}`}>
            <i className="bi bi-calendar-fill" />
          </div>
          <div className={styles.kpiBody}>
            <span className={styles.kpiValue}>{upcomingSessions}</span>
            <span className={styles.kpiLabel}>Sesiuni viitoare</span>
          </div>
        </div>
      </div>

      <div className={styles.activityGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <i className="bi bi-door-open" />
            <span>Ultimele check-in-uri</span>
            <Link href="/admin/check-ins" className={styles.panelLink}>
              Vezi tot <i className="bi bi-arrow-right" />
            </Link>
          </div>
          <div className={styles.panelBody}>
            {recentCheckIns.length === 0 ? (
              <p className={styles.empty}>Nicio intrare înregistrată.</p>
            ) : (
              recentCheckIns.map((ci) => (
                <div key={ci.id} className={styles.activityRow}>
                  <div className={styles.avatar}>
                    {(ci.user.name?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className={styles.activityInfo}>
                    <span className={styles.activityName}>
                      {ci.user.name ?? ci.user.email}
                    </span>
                    <span className={styles.activityMeta}>{timeAgo(ci.scannedAt)}</span>
                  </div>
                  <i className={`bi bi-check-circle-fill ${styles.checkIcon}`} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <i className="bi bi-bag" />
            <span>Comenzi recente</span>
            <Link href="/admin/abonamente" className={styles.panelLink}>
              Vezi tot <i className="bi bi-arrow-right" />
            </Link>
          </div>
          <div className={styles.panelBody}>
            {recentOrders.length === 0 ? (
              <p className={styles.empty}>Nicio comandă.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className={styles.activityRow}>
                  <div className={styles.avatar}>
                    {(order.user?.name?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className={styles.activityInfo}>
                    <span className={styles.activityName}>
                      {order.user?.name ?? "Anonim"}
                    </span>
                    <span className={styles.activityMeta}>
                      {order.items[0]?.categoryName} · {timeAgo(order.createdAt)}
                    </span>
                  </div>
                  <span className={styles.orderAmount}>
                    {Number(order.totalRon).toFixed(0)} lei
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
