import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getUserBadges } from '@/app/_core/badgeActions'
import { badgeDefinitions } from '@/app/_core/badges'
import BadgeGrid from '@/components/profil/badgeGrid/BadgeGrid'
import styles from './publicProfil.module.scss'

interface IPublicProfilPageProps {
  params: Promise<{ id: string }>
}

export default async function PublicProfilPage({ params }: IPublicProfilPageProps) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, image: true },
  })

  if (!user) notFound()

  const userBadges = await getUserBadges(id)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {user.image ? (
          <Image src={user.image} alt={user.name ?? 'Avatar'} width={56} height={56} className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>
            {(user.name ?? 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className={styles.name}>{user.name ?? 'Utilizator'}</h1>
      </div>
      <BadgeGrid allBadges={badgeDefinitions} unlockedBadges={userBadges} showLocked={false} />
    </div>
  )
}
