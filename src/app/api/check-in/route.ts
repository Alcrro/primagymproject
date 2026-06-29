import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { checkAndAwardBadges } from "@/app/_core/badgeActions"

interface CheckInBody {
  orderItemId: number
  memberUserId: string
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  }

  const role = session.user.role
  if (role !== "ADMIN" && role !== "TRAINER") {
    return NextResponse.json({ error: "Acces interzis" }, { status: 403 })
  }

  const body = await req.json() as CheckInBody
  const { orderItemId, memberUserId } = body

  if (!orderItemId || !memberUserId) {
    return NextResponse.json({ error: "Date incomplete" }, { status: 400 })
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      order: true,
      checkIns: true,
    },
  })

  if (!orderItem || orderItem.order.userId !== memberUserId) {
    return NextResponse.json({ error: "Abonament negăsit" }, { status: 404 })
  }

  if (orderItem.order.status !== "PAID") {
    return NextResponse.json({ error: "Comanda nu este plătită" }, { status: 400 })
  }

  const now = new Date()

  if (orderItem.totalEntries !== null && orderItem.totalEntries !== undefined) {
    const remaining = orderItem.totalEntries - orderItem.checkIns.length
    if (remaining <= 0) {
      return NextResponse.json({ error: "Nu mai sunt intrări disponibile" }, { status: 400 })
    }

    await prisma.checkIn.create({
      data: {
        orderItemId,
        userId: memberUserId,
        scannedById: session.user.id,
      },
    })

    await checkAndAwardBadges(memberUserId, 'checkin')
    revalidatePath('/profil')

    return NextResponse.json({ remainingEntries: remaining - 1 })
  }

  if (orderItem.expiresAt !== null && orderItem.expiresAt !== undefined) {
    if (orderItem.expiresAt <= now) {
      return NextResponse.json({ error: "Abonamentul a expirat" }, { status: 400 })
    }

    await prisma.checkIn.create({
      data: {
        orderItemId,
        userId: memberUserId,
        scannedById: session.user.id,
      },
    })

    await checkAndAwardBadges(memberUserId, 'checkin')
    revalidatePath('/profil')

    return NextResponse.json({ remainingEntries: null })
  }

  return NextResponse.json({ error: "Tip abonament necunoscut" }, { status: 400 })
}
