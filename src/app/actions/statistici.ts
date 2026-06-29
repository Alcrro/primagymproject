"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { IStatsOverview, IMonthlyActivity, ICalendarDay } from "@/types/statistici"

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  const uniqueDates = Array.from(
    new Set(
      dates.map((d) =>
        d.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" })
      )
    )
  ).sort().reverse()

  let streak = 1
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const curr = new Date(uniqueDates[i] + "T12:00:00Z")
    const prev = new Date(uniqueDates[i + 1] + "T12:00:00Z")
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

function toMonthlyActivity(dates: Date[]): IMonthlyActivity[] {
  const map = new Map<string, number>()

  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toLocaleDateString("ro-RO", {
      month: "short",
      year: "numeric",
      timeZone: "Europe/Bucharest",
    })
    map.set(key, 0)
  }

  for (const date of dates) {
    const key = date.toLocaleDateString("ro-RO", {
      month: "short",
      year: "numeric",
      timeZone: "Europe/Bucharest",
    })
    const current = map.get(key)
    if (current !== undefined) {
      map.set(key, current + 1)
    }
  }

  return Array.from(map.entries()).map(([month, count]) => ({ month, count }))
}

function toCalendarData(dates: Date[], futureDays = 0): ICalendarDay[] {
  const map = new Map<string, ICalendarDay>()

  for (let i = 83; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" })
    map.set(key, { date: key, count: 0 })
  }

  const capped = Math.min(futureDays, 28)
  for (let i = 1; i <= capped; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const key = d.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" })
    map.set(key, { date: key, count: 0, isFuture: true })
  }

  for (const date of dates) {
    const key = date.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" })
    const entry = map.get(key)
    if (entry && !entry.isFuture) {
      entry.count++
    }
  }

  return Array.from(map.values())
}

export async function getStatsForUser(userId: string): Promise<IStatsOverview> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Neautentificat")

  if (session.user.id !== userId && session.user.role !== "ADMIN" && session.user.role !== "TRAINER") {
    throw new Error("Acces interzis")
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const allCheckIns = await prisma.checkIn.findMany({
    where: { userId },
    select: { scannedAt: true },
    orderBy: { scannedAt: "desc" },
  })

  const allDates = allCheckIns.map((c) => c.scannedAt)
  const checkInsThisMonth = allDates.filter((d) => d >= startOfMonth).length
  const streakDays = computeStreak(allDates)
  const monthlyActivity = toMonthlyActivity(allDates)

  const classesAttended = await prisma.classBooking.count({
    where: { userId, status: "CONFIRMED" },
  })

  const activeOrderItem = await prisma.orderItem.findFirst({
    where: { order: { userId, status: "PAID" } },
    include: { _count: { select: { checkIns: true } } },
    orderBy: { createdAt: "desc" },
  })

  let entriesUsed = allCheckIns.length
  let entriesRemaining: number | null = null
  let subscriptionExpiresAt: Date | null = null
  let futureDays = 0

  if (activeOrderItem) {
    if (activeOrderItem.totalEntries !== null) {
      entriesUsed = activeOrderItem._count.checkIns
      entriesRemaining = Math.max(0, activeOrderItem.totalEntries - entriesUsed)
    } else if (activeOrderItem.expiresAt !== null) {
      subscriptionExpiresAt = activeOrderItem.expiresAt
      futureDays = Math.max(
        0,
        Math.ceil((activeOrderItem.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      )
    }
  }

  const calendarData = toCalendarData(allDates, futureDays)

  return {
    checkInsThisMonth,
    streakDays,
    entriesUsed,
    entriesRemaining,
    subscriptionExpiresAt,
    classesAttended,
    monthlyActivity,
    calendarData,
  }
}
