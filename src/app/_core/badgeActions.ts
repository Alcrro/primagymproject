import { prisma } from '@/lib/prisma'
import { subscriptionCategory } from '@/app/_core/subscriptionCategories'
import type { IUserBadge } from '@/types/badges'

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  const uniqueDates = Array.from(
    new Set(
      dates.map((d) =>
        d.toLocaleDateString('en-CA', { timeZone: 'Europe/Bucharest' })
      )
    )
  )
    .sort()
    .reverse()

  let streak = 1
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const curr = new Date(uniqueDates[i] + 'T12:00:00Z')
    const prev = new Date(uniqueDates[i + 1] + 'T12:00:00Z')
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export async function getUserBadges(userId: string): Promise<IUserBadge[]> {
  const rows = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true, unlockedAt: true },
    orderBy: { unlockedAt: 'asc' },
  })
  return rows.map((r) => ({ badgeId: r.badgeId, unlockedAt: r.unlockedAt }))
}

export async function checkAndAwardBadges(
  userId: string,
  trigger: 'checkin' | 'booking'
): Promise<void> {
  const existingRows = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  })
  const existingBadges = new Set(existingRows.map((r) => r.badgeId))

  const toAward: string[] = []

  if (trigger === 'checkin') {
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      select: {
        scannedAt: true,
        orderItem: { select: { categoryName: true } },
      },
      orderBy: { scannedAt: 'asc' },
    })

    const total = checkIns.length
    const dates = checkIns.map((c) => c.scannedAt)

    if (!existingBadges.has('first_checkin') && total >= 1) toAward.push('first_checkin')
    if (!existingBadges.has('checkin_5') && total >= 5) toAward.push('checkin_5')
    if (!existingBadges.has('checkin_10') && total >= 10) toAward.push('checkin_10')
    if (!existingBadges.has('checkin_25') && total >= 25) toAward.push('checkin_25')
    if (!existingBadges.has('checkin_50') && total >= 50) toAward.push('checkin_50')
    if (!existingBadges.has('checkin_100') && total >= 100) toAward.push('checkin_100')

    const streak = computeStreak(dates)
    if (!existingBadges.has('streak_7') && streak >= 7) toAward.push('streak_7')
    if (!existingBadges.has('streak_30') && streak >= 30) toAward.push('streak_30')

    if (!existingBadges.has('explorer')) {
      const checkedCategories = new Set(
        checkIns.map((c) => c.orderItem.categoryName.toLowerCase())
      )
      const allSlugs = subscriptionCategory.map((c) => c.link)
      if (allSlugs.every((slug) => checkedCategories.has(slug))) {
        toAward.push('explorer')
      }
    }
  }

  if (trigger === 'booking' && !existingBadges.has('first_booking')) {
    const bookingCount = await prisma.classBooking.count({
      where: { userId, status: 'CONFIRMED' },
    })
    if (bookingCount >= 1) toAward.push('first_booking')
  }

  if (toAward.length > 0) {
    await prisma.userBadge.createMany({
      data: toAward.map((badgeId) => ({ userId, badgeId })),
      skipDuplicates: true,
    })
  }
}
