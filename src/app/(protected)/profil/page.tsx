import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import QrCodeSection from "@/components/profil/qrCodeSection/QrCodeSection"
import AbonamenteActive from "@/components/profil/abonamenteActive/AbonamenteActive"
import styles from "./profil.module.scss"

export default async function ProfilPage() {
  const session = await auth()
  const userId = session!.user.id

  const orders = await prisma.order.findMany({
    where: { userId, status: "PAID" },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  const now = new Date()
  const hasActiveSub = orders.some((o) =>
    o.items.some(
      (item) =>
        (item.expiresAt && item.expiresAt > now) ||
        (item.totalEntries !== null && item.totalEntries > 0)
    )
  )

  return (
    <>
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
      <AbonamenteActive orders={orders} />
    </>
  )
}
