"use client"

import { useRouter } from "next/navigation"
import { revokeEmployee } from "@/app/actions/corporate"
import styles from "./RevokeButton.module.scss"

interface RevokeButtonProps {
  memberId: string
  memberName: string
}

export default function RevokeButton({ memberId, memberName }: RevokeButtonProps) {
  const router = useRouter()

  async function revokeHandler() {
    const confirmed = window.confirm(
      `Ești sigur că vrei să revoce accesul pentru ${memberName}? Accesul va fi oprit imediat.`
    )
    if (!confirmed) return
    try {
      await revokeEmployee(memberId)
      router.refresh()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "A apărut o eroare")
    }
  }

  return (
    <button className={styles.btn} onClick={revokeHandler}>
      Scoate
    </button>
  )
}
