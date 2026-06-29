import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const role = session.user.role
  let corporateAccountId: string | null = null

  if (role === "HR_MANAGER") {
    const account = await prisma.corporateAccount.findUnique({
      where: { hrManagerId: session.user.id },
    })
    if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 })
    corporateAccountId = account.id
  } else if (role === "ADMIN") {
    corporateAccountId = request.nextUrl.searchParams.get("accountId")
    if (!corporateAccountId) return NextResponse.json({ error: "accountId required" }, { status: 400 })
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const members = await prisma.corporateMember.findMany({
    where: { corporateAccountId, revokedAt: null },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { joinedAt: "asc" },
  })

  const rows = ["Nume,Email,Data aderarii"]
  for (const m of members) {
    const name = (m.user.name ?? "—").replace(/"/g, '""')
    const email = m.user.email.replace(/"/g, '""')
    const date = m.joinedAt.toISOString().split("T")[0]
    rows.push(`"${name}","${email}",${date}`)
  }

  const dateStr = new Date().toISOString().split("T")[0]
  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="angajati-corporate-${dateStr}.csv"`,
    },
  })
}
