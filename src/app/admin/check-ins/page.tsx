import { prisma } from "@/lib/prisma"
import Link from "next/link"
import styles from "./checkIns.module.scss"

export default async function CheckInsPage() {
  const checkIns = await prisma.checkIn.findMany({
    orderBy: { scannedAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      orderItem: { select: { planName: true, categoryName: true } },
      scannedBy: { select: { name: true } },
    },
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Intrări înregistrate</h1>
          <p className={styles.subtitle}>
            {checkIns.length} {checkIns.length === 1 ? "intrare" : "intrări"} totale
          </p>
        </div>
        <Link href="/admin/scan" className={styles.scanBtn}>
          <i className="bi bi-qr-code-scan" />
          Scanează QR
        </Link>
      </div>

      {checkIns.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nicio intrare înregistrată încă.</p>
          <p className={styles.emptySubtext}>Intrările apar după primul scan QR.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {checkIns.map((ci) => {
            const initials = (ci.user.name ?? ci.user.email)
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()

            const date = new Date(ci.scannedAt)
            const dateLabel = date.toLocaleDateString("ro-RO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            const timeLabel = date.toLocaleTimeString("ro-RO", {
              hour: "2-digit",
              minute: "2-digit",
            })

            return (
              <div key={ci.id} className={styles.row}>
                <div className={styles.avatar}>
                  {ci.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ci.user.image} alt={ci.user.name ?? ""} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div className={styles.member}>
                  <span className={styles.memberName}>{ci.user.name ?? "—"}</span>
                  <span className={styles.memberEmail}>{ci.user.email}</span>
                </div>

                <div className={styles.plan}>
                  <span className={styles.planCategory}>
                    {ci.orderItem.categoryName.charAt(0).toUpperCase() +
                      ci.orderItem.categoryName.slice(1)}
                  </span>
                  <span className={styles.planName}>{ci.orderItem.planName}</span>
                </div>

                <div className={styles.meta}>
                  <span className={styles.metaDate}>{dateLabel}</span>
                  <span className={styles.metaTime}>{timeLabel}</span>
                </div>

                <div className={styles.scannedBy}>
                  <span className={styles.scannedByLabel}>Scanat de</span>
                  <span className={styles.scannedByName}>{ci.scannedBy.name ?? "—"}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
