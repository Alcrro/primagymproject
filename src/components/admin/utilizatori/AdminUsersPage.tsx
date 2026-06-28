"use client"

import { useState, useTransition } from "react"
import { updateUserRoleAction, toggleUserActiveAction } from "@/app/actions/users"
import type { UserRole } from "@/types/auth"
import "./adminUsers.scss"

interface IUser {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  isActive: boolean
  createdAt: Date
  image: string | null
}

interface IAdminUsersPageProps {
  users: IUser[]
  currentUserId: string
}

const ROLE_LABELS: Record<UserRole, string> = {
  MEMBER: "Membru",
  TRAINER: "Antrenor",
  ADMIN: "Admin",
}

const ROLES: UserRole[] = ["MEMBER", "TRAINER", "ADMIN"]

export default function AdminUsersPage({ users, currentUserId }: IAdminUsersPageProps) {
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<UserRole | "ALL">("ALL")
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [blockingId, setBlockingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === "ALL" || u.role === filterRole
    return matchSearch && matchRole
  })

  function changeRoleHandler(userId: string, role: UserRole) {
    setPendingId(userId)
    startTransition(async () => {
      await updateUserRoleAction(userId, role)
      setPendingId(null)
    })
  }

  function toggleBlockHandler(userId: string, isActive: boolean) {
    setBlockingId(userId)
    startTransition(async () => {
      await toggleUserActiveAction(userId, isActive)
      setBlockingId(null)
    })
  }

  return (
    <div className="au-wrapper">
      <div className="au-top">
        <div>
          <h1 className="au-title">Utilizatori</h1>
          <p className="au-subtitle">{users.length} utilizatori înregistrați</p>
        </div>
      </div>

      <div className="au-filters">
        <input
          className="au-search"
          type="search"
          placeholder="Caută după nume sau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="au-role-filters">
          {(["ALL", "MEMBER", "TRAINER", "ADMIN"] as const).map((role) => (
            <button
              key={role}
              className={`au-filter-btn${filterRole === role ? " au-filter-btn--active" : ""}`}
              onClick={() => setFilterRole(role)}
            >
              {role === "ALL" ? "Toți" : ROLE_LABELS[role]}
            </button>
          ))}
        </div>
      </div>

      <div className="au-table-wrap">
        <table className="au-table">
          <thead>
            <tr>
              <th>Utilizator</th>
              <th>Rol curent</th>
              <th>Înregistrat</th>
              <th>Schimbă rol</th>
              <th>Acces</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="au-empty">Nu există utilizatori care să corespundă.</td>
              </tr>
            )}
            {filtered.map((user) => {
              const isSelf = user.id === currentUserId
              const initials = (user.name ?? user.email ?? "?")
                .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              const isLoading = isPending && pendingId === user.id
              const isBlocking = isPending && blockingId === user.id

              return (
                <tr key={user.id} className={`${isSelf ? "au-row-self" : ""}${!user.isActive ? " au-row-blocked" : ""}`}>
                  <td>
                    <div className="au-user-cell">
                      <div className="au-avatar">
                        {user.image
                          ? <img src={user.image} alt={user.name ?? ""} />
                          : <span>{initials}</span>
                        }
                      </div>
                      <div>
                        <p className="au-name">{user.name ?? "—"}</p>
                        <p className="au-email">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`au-badge au-badge--${user.role.toLowerCase()}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="au-date">
                    {new Date(user.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td>
                    {isSelf ? (
                      <span className="au-self-note">Cont propriu</span>
                    ) : (
                      <select
                        className="au-select"
                        value={user.role}
                        disabled={isLoading}
                        onChange={(e) => changeRoleHandler(user.id, e.target.value as UserRole)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {isSelf ? (
                      <span className="au-self-note">—</span>
                    ) : (
                      <button
                        className={`au-block-btn${user.isActive ? " au-block-btn--active" : " au-block-btn--blocked"}`}
                        disabled={isBlocking}
                        onClick={() => toggleBlockHandler(user.id, !user.isActive)}
                      >
                        {isBlocking ? "..." : user.isActive ? "Blochează" : "Deblochează"}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
