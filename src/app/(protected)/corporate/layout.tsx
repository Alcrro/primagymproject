import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function CorporateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "HR_MANAGER") {
    redirect("/")
  }

  return <>{children}</>
}
