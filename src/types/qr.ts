export interface IActiveSub {
  orderItemId: number
  planName: string
  categoryName: string
  type: "entries" | "monthly"
  remainingEntries?: number
  totalEntries?: number
  expiresAt?: string
}

export interface IMemberData {
  userId: string
  name: string | null
  email: string | null
  image: string | null
  subscriptions: IActiveSub[]
}
