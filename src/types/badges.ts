export interface IBadgeDefinition {
  id: string
  title: string
  description: string
  condition: string
  icon: string
}

export interface IUserBadge {
  badgeId: string
  unlockedAt: Date
}
