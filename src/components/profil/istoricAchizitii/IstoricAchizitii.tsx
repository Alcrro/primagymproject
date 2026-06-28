import React from "react"
import { Prisma } from "@prisma/client"
import styles from "./IstoricAchizitii.module.scss"

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>

const STATUS_LABEL: Record<string, string> = {
  PAID:      "Plătit",
  PENDING:   "În așteptare",
  CANCELLED: "Anulat",
  EXPIRED:   "Expirat",
}

const STATUS_CLASS: Record<string, string> = {
  PAID:      styles.badgePaid,
  PENDING:   styles.badgePending,
  CANCELLED: styles.badgeCancelled,
  EXPIRED:   styles.badgeExpired,
}

export default function IstoricAchizitii({ orders }: { orders: OrderWithItems[] }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h2 className={styles.title}>Istoric achiziții</h2>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>Nicio achiziție înregistrată încă.</p>
          <p className={styles.emptySubtext}>
            Achizițiile tale vor apărea aici după prima comandă.
          </p>
        </div>
      ) : (
        <ul className={styles.list}>
          {orders.map((order) => (
            <li key={order.id} className={styles.order}>
              <div className={styles.orderMeta}>
                <span className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className={`${styles.badge} ${STATUS_CLASS[order.status] ?? ""}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>

              <ul className={styles.itemList}>
                {order.items.map((item) => (
                  <li key={item.id} className={styles.orderItem}>
                    <span className={styles.orderItemName}>{item.planName}</span>
                    {item.quantity > 1 && (
                      <span className={styles.orderItemQty}>x{item.quantity}</span>
                    )}
                    <span className={styles.orderItemPrice}>
                      {Number(item.priceRon) * item.quantity} Lei
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.orderTotal}>
                Total: <strong>{Number(order.totalRon)} Lei</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
