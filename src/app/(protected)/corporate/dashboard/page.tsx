import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import InviteEmployeeButton from "@/components/corporate/InviteEmployeeButton"
import RevokeButton from "@/components/corporate/RevokeButton"
import styles from "./dashboard.module.scss"

export default async function CorporateDashboardPage() {
  const session = await auth()
  if (!session?.user) return null

  const account = await prisma.corporateAccount.findUnique({
    where: { hrManagerId: session.user.id },
  })

  if (!account) {
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorTitle}>Cont corporate negăsit</p>
        <p>Nu există un cont corporate asociat acestui utilizator.</p>
      </div>
    )
  }

  const [members, invites] = await Promise.all([
    prisma.corporateMember.findMany({
      where: { corporateAccountId: account.id, revokedAt: null },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.corporateInvite.findMany({
      where: { corporateAccountId: account.id, acceptedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const pct = account.seatsTotal > 0 ? (account.seatsUsed / account.seatsTotal) * 100 : 0
  const seatsAvailable = account.seatsTotal - account.seatsUsed

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{account.companyName}</h1>
          <p className={styles.subtitle}>Panou HR — gestionare acces angajați</p>
        </div>
        <InviteEmployeeButton corporateAccountId={account.id} />
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{account.seatsTotal}</div>
          <div className={styles.statLabel}>Locuri totale</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{account.seatsUsed}</div>
          <div className={styles.statLabel}>Locuri ocupate</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{seatsAvailable}</div>
          <div className={styles.statLabel}>Locuri disponibile</div>
        </div>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressLabel}>
          <span>Ocupare locuri</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <i className="bi bi-people" />
          <span>Angajați activi ({members.length})</span>
          <div className={styles.actions}>
            <a
              href="/api/corporate/export"
              className={styles.exportBtn}
              download
            >
              <i className="bi bi-download" />
              Export CSV
            </a>
          </div>
        </div>
        {members.length === 0 ? (
          <p className={styles.empty}>Niciun angajat activ. Invită primul angajat.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nume</th>
                <th>Email</th>
                <th>Data aderării</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.user.name ?? <span className={styles.muted}>—</span>}</td>
                  <td>{m.user.email}</td>
                  <td className={styles.muted}>
                    {m.joinedAt.toLocaleDateString("ro-RO")}
                  </td>
                  <td>
                    <RevokeButton
                      memberId={m.id}
                      memberName={m.user.name ?? m.user.email}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <i className="bi bi-envelope" />
          <span>Invitații în așteptare ({invites.length})</span>
        </div>
        {invites.length === 0 ? (
          <p className={styles.empty}>Nicio invitație activă.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Expiră</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.email}</td>
                  <td className={styles.muted}>
                    {inv.expiresAt.toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <span className={styles.statusBadge}>Trimisă</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
