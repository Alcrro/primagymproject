import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = request.nextUrl
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")

  const now = new Date()
  const from = fromParam ? new Date(`${fromParam}T00:00:00`) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const to = toParam ? new Date(`${toParam}T23:59:59`) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  const orders = await prisma.order.findMany({
    where: {
      status: "PAID",
      createdAt: { gte: from, lte: to },
    },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { planName: true, categoryName: true, quantity: true, priceRon: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const csvRows: string[] = ["ID,Utilizator,Email,Plan,Categorie,Cantitate,Pret (RON),Data"]

  for (const order of orders) {
    const userName = order.user?.name ?? "—"
    const userEmail = order.user?.email ?? "—"
    const createdAt = order.createdAt.toISOString().split("T")[0]

    for (const item of order.items) {
      const row = [
        order.id,
        `"${userName.replace(/"/g, '""')}"`,
        `"${userEmail.replace(/"/g, '""')}"`,
        `"${item.planName.replace(/"/g, '""')}"`,
        `"${item.categoryName.replace(/"/g, '""')}"`,
        item.quantity,
        Number(item.priceRon).toFixed(2),
        createdAt,
      ].join(",")
      csvRows.push(row)
    }
  }

  const csv = csvRows.join("\n")
  const dateStr = now.toISOString().split("T")[0]

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="comenzi-${dateStr}.csv"`,
    },
  })
}
