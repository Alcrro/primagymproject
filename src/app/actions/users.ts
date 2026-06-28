"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { UserRole } from "@/types/auth"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
  return session.user
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
  const admin = await requireAdmin()
  if (admin.id === userId) throw new Error("Nu îți poți schimba propriul rol.")

  await prisma.user.update({ where: { id: userId }, data: { role } })
  revalidatePath("/admin/utilizatori")
}

export async function toggleUserActiveAction(userId: string, isActive: boolean) {
  const admin = await requireAdmin()
  if (admin.id === userId) throw new Error("Nu îți poți bloca propriul cont.")

  await prisma.user.update({ where: { id: userId }, data: { isActive } })
  revalidatePath("/admin/utilizatori")
}
