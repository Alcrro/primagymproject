import React from "react"
import Image from "next/image"
import { logoutAction } from "@/app/actions/auth"
import EditNume from "@/components/profil/editNume/EditNume"
import ResendVerificationButton from "./ResendVerificationButton"
import styles from "./ProfilHeader.module.scss"
import type { UserRole } from "@/types/auth"

interface IProfilHeaderProps {
  name: string | null
  email: string | null
  image: string | null
  role: UserRole
  createdAt: Date
  isOAuth: boolean
  emailVerified: Date | null
}

const roleLabels: Record<UserRole, string> = {
  MEMBER: "Membru",
  TRAINER: "Antrenor",
  ADMIN: "Administrator",
}

const roleClass: Record<UserRole, string> = {
  MEMBER: styles.roleMember,
  TRAINER: styles.roleTrainer,
  ADMIN: styles.roleAdmin,
}

export default function ProfilHeader({
  name,
  email,
  image,
  role,
  createdAt,
  isOAuth,
  emailVerified,
}: IProfilHeaderProps) {
  const memberSince = new Date(createdAt).toLocaleDateString("ro-RO", {
    month: "long",
    year: "numeric",
  })

  return (
    <>
      {!emailVerified && !isOAuth && (
        <div className={styles.verifyBanner}>
          <span>Adresa de email nu a fost confirmată. Verifică-ți căsuța poștală.</span>
          <ResendVerificationButton />
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.avatarSection}>
          {image ? (
            <Image
              src={image}
              alt={name ?? "Profil"}
              width={88}
              height={88}
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatarInitial}>
              {name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <span className={`${styles.roleBadge} ${roleClass[role]}`}>
            {roleLabels[role]}
          </span>
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{name ?? "Utilizator"}</h1>
          <EditNume currentName={name} />
          <p className={styles.email}>{email}</p>
          <p className={styles.since}>
            <span className={styles.sinceIcon}>📅</span>
            Membru din {memberSince}
          </p>
          {isOAuth && (
            <p className={styles.oauthNote}>
              <span className={styles.sinceIcon}>🔗</span>
              Cont conectat prin OAuth
            </p>
          )}
        </div>

        <form action={logoutAction} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Deconectare
          </button>
        </form>
      </div>
    </>
  )
}
