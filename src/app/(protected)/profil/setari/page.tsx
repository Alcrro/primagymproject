import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ProfilHeader from "@/components/profil/profilHeader/ProfilHeader"
import SchimbareParola from "@/components/profil/schimbareParola/SchimbareParola"
import styles from "./setari.module.scss"

export default async function ProfilSetariPage() {
  const session = await auth()
  const userId = session!.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { createdAt: true, password: true, name: true, emailVerified: true },
  })

  const isOAuth = !user?.password

  return (
    <>
      <ProfilHeader
        name={user?.name ?? session!.user.name ?? null}
        email={session!.user.email ?? null}
        image={session!.user.image ?? null}
        role={session!.user.role}
        createdAt={user?.createdAt ?? new Date()}
        isOAuth={isOAuth}
        emailVerified={user?.emailVerified ?? null}
      />
      {!isOAuth ? (
        <SchimbareParola />
      ) : (
        <div className={styles.oauthCard}>
          <p className={styles.oauthTitle}>Cont OAuth</p>
          <p className={styles.oauthText}>
            Contul tău este conectat printr-un provider extern. Parola se gestionează acolo.
          </p>
        </div>
      )}
    </>
  )
}
