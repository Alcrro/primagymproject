import Image from "next/image"
import { IMemberData } from "@/types/qr"
import ActiveSubCard from "./ActiveSubCard"
import styles from "./scanner.module.scss"

interface MemberCardProps {
  member: IMemberData
  onCheckIn: (orderItemId: number, newRemaining: number | null) => void
}

export default function MemberCard({ member, onCheckIn }: MemberCardProps) {
  return (
    <div className={styles.memberCard}>
      <div className={styles.memberInfo}>
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name ?? "Membru"}
            width={64}
            height={64}
            className={styles.memberAvatar}
          />
        ) : (
          <div className={styles.memberAvatarPlaceholder}>
            {(member.name ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.memberDetails}>
          <p className={styles.memberName}>{member.name ?? "—"}</p>
          <p className={styles.memberEmail}>{member.email ?? "—"}</p>
        </div>
      </div>

      {member.subscriptions.length === 0 ? (
        <p className={styles.noSubs}>Niciun abonament activ.</p>
      ) : (
        <div className={styles.subsList}>
          {member.subscriptions.map((sub) => (
            <ActiveSubCard
              key={sub.orderItemId}
              sub={sub}
              memberUserId={member.userId}
              onCheckIn={onCheckIn}
            />
          ))}
        </div>
      )}
    </div>
  )
}
