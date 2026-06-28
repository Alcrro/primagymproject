import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import styles from "./admin.module.scss"

export default async function AdminPage() {
  const session = await auth()

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalMembers, ordersThisMonth, checkInsToday, upcomingSessions] =
    await Promise.all([
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.order.count({ where: { status: "PAID", createdAt: { gte: startOfMonth } } }),
      prisma.checkIn.count({ where: { scannedAt: { gte: startOfDay } } }),
      prisma.classSession.count({ where: { status: "SCHEDULED", startAt: { gte: now } } }),
    ])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <p className={styles.subtitle}>
        Autentificat ca <strong>{session!.user.name}</strong> · {session!.user.email}
      </p>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Membri totali</span>
          <span className={styles.statValue}>{totalMembers}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Comenzi luna aceasta</span>
          <span className={styles.statValue}>{ordersThisMonth}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Check-in-uri azi</span>
          <span className={styles.statValue}>{checkInsToday}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Sesiuni viitoare</span>
          <span className={styles.statValue}>{upcomingSessions}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/scan" className={styles.actionCard}>
          <i className="bi bi-qr-code-scan" />
          <span>Scanează QR</span>
        </Link>
        <Link href="/admin/check-ins" className={styles.actionCard}>
          <i className="bi bi-list-check" />
          <span>Intrări înregistrate</span>
        </Link>
        <Link href="/admin/sesiuni" className={styles.actionCard}>
          <i className="bi bi-calendar-event" />
          <span>Sesiuni</span>
        </Link>
        <Link href="/admin/locatii" className={styles.actionCard}>
          <i className="bi bi-geo-alt" />
          <span>Locații</span>
        </Link>
        <Link href="/admin/abonamente" className={styles.actionCard}>
          <i className="bi bi-credit-card" />
          <span>Abonamente</span>
        </Link>
        <Link href="/admin/discounturi" className={styles.actionCard}>
          <i className="bi bi-tag" />
          <span>Discounturi</span>
        </Link>
        <Link href="/admin/antrenori" className={styles.actionCard}>
          <i className="bi bi-person-badge" />
          <span>Antrenori</span>
        </Link>
        <Link href="/admin/utilizatori" className={styles.actionCard}>
          <i className="bi bi-people" />
          <span>Utilizatori</span>
        </Link>
        <Link href="/admin/galerie" className={styles.actionCard}>
          <i className="bi bi-images" />
          <span>Galerie</span>
        </Link>
      </div>
    </div>
  )
}
