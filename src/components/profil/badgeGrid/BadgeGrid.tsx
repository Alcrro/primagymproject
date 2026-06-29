import type { IBadgeDefinition, IUserBadge } from '@/types/badges'
import BadgeCard from '@/components/profil/badgeCard/BadgeCard'
import styles from './BadgeGrid.module.scss'

interface IBadgeGridProps {
  allBadges: IBadgeDefinition[]
  unlockedBadges: IUserBadge[]
  showLocked?: boolean
}

export default function BadgeGrid({
  allBadges,
  unlockedBadges,
  showLocked = true,
}: IBadgeGridProps) {
  const unlockedMap = new Map(unlockedBadges.map((b) => [b.badgeId, b.unlockedAt]))
  const visibleBadges = showLocked ? allBadges : allBadges.filter((b) => unlockedMap.has(b.id))

  if (visibleBadges.length === 0) {
    return (
      <div className={styles.section}>
        <h2 className={styles.heading}>Achievements</h2>
        <p className={styles.empty}>
          Niciun badge deblocat încă. Fă primul check-in la sală pentru a începe!
        </p>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>
        Achievements
        {unlockedBadges.length > 0 && (
          <span className={styles.count}>
            {unlockedBadges.length}/{allBadges.length}
          </span>
        )}
      </h2>
      <div className={styles.grid}>
        {visibleBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            definition={badge}
            unlockedAt={unlockedMap.get(badge.id)}
          />
        ))}
      </div>
    </div>
  )
}
