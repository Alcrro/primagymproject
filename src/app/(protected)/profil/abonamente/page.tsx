import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import AbonamenteActive from "@/components/profil/abonamenteActive/AbonamenteActive"
import IstoricAchizitii from "@/components/profil/istoricAchizitii/IstoricAchizitii"
import styles from "./abonamente.module.scss"

export default async function ProfilAbonamentePage() {
  const session = await auth()
  const userId = session!.user.id

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  const paidOrders = orders.filter((o) => o.status === "PAID")

  return (
    <div className={styles.grid}>
      <AbonamenteActive orders={paidOrders} />
      <IstoricAchizitii orders={orders} />
    </div>
  )
}
