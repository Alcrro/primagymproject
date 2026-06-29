import { Suspense } from "react"
import { auth } from "@/auth"
import { getStatsForUser } from "@/app/actions/statistici"
import StatsOverview from "@/components/statistici/StatsOverview"
import StatsSkeleton from "@/components/statistici/StatsSkeleton"
import styles from "./statistici.module.scss"

export default async function StatisticiPage() {
  const session = await auth()
  const userId = session!.user.id

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Statisticile mele</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsContent userId={userId} />
      </Suspense>
    </div>
  )
}

async function StatsContent({ userId }: { userId: string }) {
  const stats = await getStatsForUser(userId)
  return <StatsOverview stats={stats} />
}
