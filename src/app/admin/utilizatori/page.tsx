import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminUsersPage from "@/components/admin/utilizatori/AdminUsersPage"

export default async function UtilizatoriPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/admin")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, image: true },
  })

  return <AdminUsersPage users={users} currentUserId={session.user.id} />
}
