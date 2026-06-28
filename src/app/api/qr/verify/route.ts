import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"

interface ActiveSub {
  orderItemId: number
  planName: string
  categoryName: string
  type: "entries" | "monthly"
  remainingEntries?: number
  totalEntries?: number
  expiresAt?: string
}

interface JwtPayload {
  userId: string
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { token?: string }
  const { token } = body

  if (!token) {
    return NextResponse.json({ error: "Token lipsă" }, { status: 400 })
  }

  const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

  let payload: JwtPayload
  try {
    const result = await jwtVerify(token, secret)
    payload = result.payload as unknown as JwtPayload
  } catch {
    return NextResponse.json({ error: "Token invalid sau expirat" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      orders: {
        where: { status: "PAID" },
        include: {
          items: {
            include: {
              checkIns: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Utilizator negăsit" }, { status: 404 })
  }

  const now = new Date()
  const subscriptions: ActiveSub[] = []

  for (const order of user.orders) {
    for (const item of order.items) {
      if (item.totalEntries !== null && item.totalEntries !== undefined) {
        const used = item.checkIns.length
        const remaining = item.totalEntries - used
        if (remaining > 0) {
          subscriptions.push({
            orderItemId: item.id,
            planName: item.planName,
            categoryName: item.categoryName,
            type: "entries",
            remainingEntries: remaining,
            totalEntries: item.totalEntries,
          })
        }
      } else if (item.expiresAt !== null && item.expiresAt !== undefined) {
        if (item.expiresAt > now) {
          subscriptions.push({
            orderItemId: item.id,
            planName: item.planName,
            categoryName: item.categoryName,
            type: "monthly",
            expiresAt: item.expiresAt.toISOString(),
          })
        }
      }
    }
  }

  return NextResponse.json({
    userId: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    subscriptions,
  })
}
