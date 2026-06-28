import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ProfilHeader from "@/components/profil/profilHeader/ProfilHeader"
import AbonamenteActive from "@/components/profil/abonamenteActive/AbonamenteActive"
import IstoricAchizitii from "@/components/profil/istoricAchizitii/IstoricAchizitii"
import SchimbareParola from "@/components/profil/schimbareParola/SchimbareParola"
import QrCodeSection from "@/components/profil/qrCodeSection/QrCodeSection"
import styles from "./profil.module.scss"

export default async function ProfilPage() {
  const session = await auth()
  const userId = session!.user.id

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, password: true, name: true, emailVerified: true },
    }),
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const isOAuth = !user?.password
  const paidOrders = orders.filter((o) => o.status === "PAID")

  const now = new Date()
  const hasActiveSub = paidOrders.some((o) =>
    o.items.some(
      (item) =>
        (item.expiresAt && item.expiresAt > now) ||
        (item.totalEntries !== null && item.totalEntries > 0)
    )
  )

  return (
    <div className={styles.wrapper}>
      <ProfilHeader
        name={user?.name ?? session!.user.name ?? null}
        email={session!.user.email ?? null}
        image={session!.user.image ?? null}
        role={session!.user.role}
        createdAt={user?.createdAt ?? new Date()}
        isOAuth={isOAuth}
        emailVerified={user?.emailVerified ?? null}
      />

      <div className={styles.grid}>
        {/* Sidebar primul în DOM → apare primul pe mobil */}
        <div className={styles.sidebar}>
          {hasActiveSub && <QrCodeSection />}
          {!isOAuth && <SchimbareParola />}
          {isOAuth && (
            <div className={styles.oauthCard}>
              <div className={styles.oauthIcon}>🔗</div>
              <p className={styles.oauthTitle}>Cont OAuth</p>
              <p className={styles.oauthText}>
                Contul tău este conectat printr-un provider extern. Parola se gestionează acolo.
              </p>
            </div>
          )}
        </div>

        <div className={styles.main}>
          <AbonamenteActive orders={paidOrders} />
          <IstoricAchizitii orders={orders} />
        </div>
      </div>
    </div>
  )
}
