import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ProfilSidebar from "@/components/profil/profilSidebar/ProfilSidebar"
import styles from "./profilLayout.module.scss"

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userId = session!.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })

  return (
    <div className={styles.layout}>
      <ProfilSidebar
        name={user?.name ?? session!.user.name ?? null}
        image={session!.user.image ?? null}
        role={session!.user.role}
      />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}
