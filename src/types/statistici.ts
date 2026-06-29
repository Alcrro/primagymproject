export interface IMonthlyActivity {
  month: string
  count: number
}

export interface ICalendarDay {
  date: string
  count: number
  isFuture?: boolean
}

export interface IStatsOverview {
  checkInsThisMonth: number
  streakDays: number
  entriesUsed: number
  entriesRemaining: number | null
  subscriptionExpiresAt: Date | null
  classesAttended: number
  monthlyActivity: IMonthlyActivity[]
  calendarData: ICalendarDay[]
}
