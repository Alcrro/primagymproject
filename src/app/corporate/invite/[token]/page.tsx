import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { acceptCorporateInvite } from "@/app/actions/corporate"
import styles from "./invite.module.scss"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function CorporateInvitePage({ params }: PageProps) {
  const { token } = await params
  const session = await auth()

  const invite = await prisma.corporateInvite.findUnique({
    where: { token },
    include: { corporateAccount: { select: { companyName: true } } },
  })

  if (!invite) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={`${styles.iconWrap} ${styles.iconError}`}>
            <i className="bi bi-x-circle" />
          </div>
          <p className={styles.title}>Invitație invalidă</p>
          <p className={styles.subtitle}>
            Această invitație nu există sau a fost deja folosită.
          </p>
          <Link href="/abonamente" className={styles.linkSecondary}>
            Vezi abonamentele noastre
          </Link>
        </div>
      </div>
    )
  }

  if (invite.acceptedAt) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={`${styles.iconWrap} ${styles.iconSuccess}`}>
            <i className="bi bi-check-circle" />
          </div>
          <p className={styles.title}>Invitație deja folosită</p>
          <p className={styles.subtitle}>
            Această invitație a fost deja acceptată.
          </p>
          <Link href="/corporate/dashboard" className={styles.link}>
            Mergi la panou
          </Link>
        </div>
      </div>
    )
  }

  if (invite.expiresAt < new Date()) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={`${styles.iconWrap} ${styles.iconError}`}>
            <i className="bi bi-clock-history" />
          </div>
          <p className={styles.title}>Invitație expirată</p>
          <p className={styles.subtitle}>
            Această invitație a expirat. Contactează managerul HR pentru o nouă invitație.
          </p>
          <Link href="/abonamente" className={styles.linkSecondary}>
            Vezi abonamentele noastre
          </Link>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    redirect(`/login?callbackUrl=/corporate/invite/${token}`)
  }

  await acceptCorporateInvite(token)
  redirect("/corporate/dashboard")
}
