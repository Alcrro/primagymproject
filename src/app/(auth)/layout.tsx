import React from "react"
import styles from "./authLayout.module.scss"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>{children}</div>
    </div>
  )
}
