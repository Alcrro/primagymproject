import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getMiniStats } from "@/app/actions/statistici"
import { getUserBadges } from "@/app/_core/badgeActions"
import { badgeDefinitions } from "@/app/_core/badges"
import QrCodeSection from "@/components/profil/qrCodeSection/QrCodeSection"
import AbonamenteActive from "@/components/profil/abonamenteActive/AbonamenteActive"
import MiniStats from "@/components/profil/miniStats/MiniStats"
import BadgeGrid from "@/components/profil/badgeGrid/BadgeGrid"
import styles from "./profil.module.scss"

export default async function ProfilPage() {
  const session = await auth()
  const userId = session!.user.id

  const [orders, miniStats, userBadges] = await Promise.all([
    prisma.order.findMany({
      where: { userId, status: "PAID" },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    getMiniStats(userId),
    getUserBadges(userId),
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
  )
}
