import type { IBadgeDefinition } from '@/types/badges'
import styles from './BadgeCard.module.scss'

interface IBadgeCardProps {
  definition: IBadgeDefinition
  unlockedAt?: Date
}

export default function BadgeCard({ definition, unlockedAt }: IBadgeCardProps) {
  const isUnlocked = unlockedAt !== undefined
  const tooltip = isUnlocked
    ? `Deblocat pe ${unlockedAt.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : definition.condition

  return (
    <div
      className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
      data-tooltip={tooltip}
    >
      <span className={styles.icon}>{definition.icon}</span>
      <span className={styles.title}>{definition.title}</span>
    </div>
  )
}
