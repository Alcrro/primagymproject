import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminNav from "@/components/admin/AdminNav"
import React from "react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) redirect("/login")
  if (session.user.role !== "ADMIN" && session.user.role !== "TRAINER") redirect("/")

  return (
    <>
      <AdminNav />
      {children}
    </>
  )
}
