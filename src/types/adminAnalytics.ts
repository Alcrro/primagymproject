export interface IRevenueDataPoint {
  date: string
  revenue: number
}

export interface ISubscriptionByCategory {
  category: string
  count: number
}

export interface IPeakHourDataPoint {
  hour: number
  checkIns: number
}

export interface ITopTrainer {
  trainerId: number
  name: string
  bookings: number
}

export interface IMembersDataPoint {
  week: string
  newMembers: number
}

export interface IKpiData {
  mrr: number
  activeMembers: number
  retentionRate: number
  noShowRate: number
}
