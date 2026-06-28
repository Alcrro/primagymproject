import React from "react"
import Link from "next/link"
import { Prisma } from "@prisma/client"
import styles from "./AbonamenteActive.module.scss"

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>

function fmtDate(date: Date) {
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "numeric", month: "long", year: "numeric",
  })
}

export default function AbonamenteActive({ orders }: { orders: OrderWithItems[] }) {
  const now = new Date()
  const activeItems = orders
    .flatMap((o) => o.items)
    .filter((item) => !item.expiresAt || item.expiresAt > now)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        <h2 className={styles.title}>Abonamente active</h2>
      </div>

      {activeItems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏋️</div>
          <p className={styles.emptyText}>Nu ai niciun abonament activ momentan.</p>
          <p className={styles.emptySubtext}>
            Alege un abonament potrivit și începe-ți antrenamentele astăzi.
          </p>
          <Link href="/abonamente" className={styles.ctaBtn}>
            Vezi abonamente
          </Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {activeItems.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemCategory}>
                {item.categoryName.charAt(0).toUpperCase() + item.categoryName.slice(1)}
              </div>
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{item.planName}</span>
                {item.expiresAt && (
                  <span className={styles.itemExpiry}>
                    Valabil până la {fmtDate(item.expiresAt)}
                  </span>
                )}
              </div>
              {item.quantity > 1 && (
                <div className={styles.itemQty}>x{item.quantity}</div>
              )}
              <div className={styles.itemBadge}>Activ</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
