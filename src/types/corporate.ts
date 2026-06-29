export type CorporateStatus = "ACTIVE" | "SUSPENDED" | "CANCELLED"

export interface ICorporateAccount {
  id: string
  companyName: string
  seatsTotal: number
  seatsUsed: number
  stripeSubscriptionId: string | null
  status: CorporateStatus
  hrManagerId: string
  createdAt: Date
}

export interface ICorporateMember {
  id: string
  corporateAccountId: string
  userId: string
  joinedAt: Date
  revokedAt: Date | null
  user: {
    name: string | null
    email: string
  }
}

export interface ICorporateInvite {
  id: string
  email: string
  token: string
  expiresAt: Date
  acceptedAt: Date | null
  createdAt: Date
}
