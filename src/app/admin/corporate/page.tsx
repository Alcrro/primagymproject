import { prisma } from "@/lib/prisma"
import AdminCorporateForm from "@/components/admin/corporate/AdminCorporateForm"
import styles from "./corporate.module.scss"
import type { CorporateStatus } from "@/types/corporate"

function statusLabel(status: CorporateStatus): string {
  if (status === "ACTIVE") return "Activ"
  if (status === "SUSPENDED") return "Suspendat"
  return "Anulat"
}

function statusClass(status: CorporateStatus, s: typeof styles): string {
  if (status === "ACTIVE") return `${s.statusBadge} ${s.statusActive}`
  if (status === "SUSPENDED") return `${s.statusBadge} ${s.statusSuspended}`
  return `${s.statusBadge} ${s.statusCancelled}`
}

export default async function AdminCorporatePage() {
  const accounts = await prisma.corporateAccount.findMany({
    orderBy: { createdAt: "desc" },
    include: { hrManager: { select: { email: true, name: true } } },
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Corporate</h1>
          <p className={styles.subtitle}>Conturi corporate și locuri alocate</p>
        </div>
        <AdminCorporateForm />
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <i className="bi bi-building" />
          <span>Companii ({accounts.length})</span>
        </div>
        {accounts.length === 0 ? (
          <p className={styles.empty}>Niciun cont corporate creat încă.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Companie</th>
                <th>HR Manager</th>
                <th>Locuri</th>
                <th>Status</th>
                <th>Creat</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => {
                const pct = acc.seatsTotal > 0 ? (acc.seatsUsed / acc.seatsTotal) * 100 : 0
                return (
                  <tr key={acc.id}>
                    <td>{acc.companyName}</td>
                    <td>
                      <div>{acc.hrManager.name ?? <span className={styles.muted}>—</span>}</div>
                      <div className={styles.muted} style={{ fontSize: "0.75rem" }}>
                        {acc.hrManager.email}
                      </div>
                    </td>
                    <td>
                      <div className={styles.seatsBar}>
                        <div className={styles.seatsTrack}>
                          <div
                            className={styles.seatsFill}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className={styles.seatsLabel}>
                          {acc.seatsUsed}/{acc.seatsTotal}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={statusClass(acc.status as CorporateStatus, styles)}>
                        {statusLabel(acc.status as CorporateStatus)}
                      </span>
                    </td>
                    <td className={styles.muted}>
                      {acc.createdAt.toLocaleDateString("ro-RO")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
