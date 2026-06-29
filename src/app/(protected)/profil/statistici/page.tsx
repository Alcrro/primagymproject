import { Suspense } from "react"
import { auth } from "@/auth"
import { getStatsForUser } from "@/app/actions/statistici"
import StatsOverview from "@/components/statistici/StatsOverview"
import StatsSkeleton from "@/components/statistici/StatsSkeleton"

export default async function StatisticiPage() {
  const session = await auth()
  const userId = session!.user.id

  return (
    <Suspense fallback={<StatsSkeleton />}>
      <StatsContent userId={userId} />
    </Suspense>
  )
}

async function StatsContent({ userId }: { userId: string }) {
  const stats = await getStatsForUser(userId)
  return <StatsOverview stats={stats} />
}
