"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { logoutAction } from "@/app/actions/auth"
import styles from "./NavbarAuth.module.scss"
import type { IAuthUser } from "@/types/auth"

interface INavbarAuthProps {
  user: IAuthUser | null
}

export default function NavbarAuth({ user }: INavbarAuthProps) {
  if (!user) {
    return (
      <li className={styles.authItem}>
        <Link href="/login" className={styles.loginBtn}>
          Login
        </Link>
      </li>
    )
  }

  return (
    <li className={styles.authItem}>
      <div className={styles.userMenu}>
        <Link href="/profil" className={styles.userInfo}>
          {user.image ? (
            <Image src={user.image} alt={user.name ?? "Profil"} width={32} height={32} className={styles.avatar} />
          ) : (
            <span className={styles.avatarInitial}>
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </span>
          )}
          <span className={styles.userName}>{user.name}</span>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutBtn}>
            Logout
          </button>
        </form>
      </div>
    </li>
  )
}
