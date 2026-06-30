import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getMiniStats } from "@/app/actions/statistici"
import { getUserBadges } from "@/app/_core/badgeActions"
import { badgeDefinitions } from "@/app/_core/badges"
import QrCodeSection from "@/components/profil/qrCodeSection/QrCodeSection"
import AbonamenteActive from "@/components/profil/abonamenteActive/AbonamenteActive"
import MiniStats from "@/components/profil/miniStats/MiniStats"
import BadgeGrid from "@/components/profil/badgeGrid/BadgeGrid"
import Link from "next/link"
import styles from "./profil.module.scss"

export default async function ProfilPage() {
  const session = await auth()
  const userId = session!.user.id

  const [orders, miniStats, userBadges, clientProfile] = await Promise.all([
    prisma.order.findMany({
      where: { userId, status: "PAID" },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    getMiniStats(userId),
    getUserBadges(userId),
    prisma.clientProfile.findUnique({ where: { userId }, select: { id: true } }),
  ])

  const now = new Date()
  const hasActiveSub = orders.some((o) =>
    o.items.some(
      (item) =>
        (item.expiresAt && item.expiresAt > now) ||
        (item.totalEntries !== null && item.totalEntries > 0)
    )
  )

  return (
    <div className={styles.page}>
      {!clientProfile && (
        <Link href="/profil/fisa" className={styles.fisaWarning}>
          <div className={styles.fisaWarningIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className={styles.fisaWarningText}>
            <span className={styles.fisaWarningTitle}>Fișa ta medicală nu este completată</span>
            <span className={styles.fisaWarningSub}>Ajută antrenorul să te cunoască înainte de prima ședință — durează 2 minute</span>
          </div>
          <svg className={styles.fisaWarningArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      )}

      <div className={styles.twoCol}>
        {hasActiveSub ? (
          <QrCodeSection />
        ) : (
          <div className={styles.noSubCard}>
            <p className={styles.noSubTitle}>Niciun abonament activ</p>
            <p className={styles.noSubText}>
              Achiziționează un abonament pentru a obține acces QR la sală.
            </p>
          </div>
        )}
        <div className={styles.rightCol}>
          <MiniStats streakDays={miniStats.streakDays} checkInsThisMonth={miniStats.checkInsThisMonth} />
          <BadgeGrid allBadges={badgeDefinitions} unlockedBadges={userBadges} />
          <AbonamenteActive orders={orders} />
        </div>
      </div>
    </div>
  )
}
