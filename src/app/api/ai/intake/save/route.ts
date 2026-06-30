import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { IClientProfileData, IAiMessage } from "@/types/ai"

interface ISaveBody {
  profile: IClientProfileData
  conversation: IAiMessage[]
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  }

  const body = await req.json() as ISaveBody
  const { profile, conversation } = body

  await prisma.clientProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      reason: profile.reason || null,
      injuries: profile.injuries || null,
      medicalRestrictions: profile.medicalRestrictions || null,
      fitnessGoal: profile.fitnessGoal || null,
      experienceLevel: profile.experienceLevel || null,
      daysPerWeek: profile.daysPerWeek || null,
      preferredHours: profile.preferredHours || null,
      aiSummary: profile.aiSummary || null,
      rawConversation: conversation as unknown as Prisma.InputJsonValue,
    },
    update: {
      reason: profile.reason || null,
      injuries: profile.injuries || null,
      medicalRestrictions: profile.medicalRestrictions || null,
      fitnessGoal: profile.fitnessGoal || null,
      experienceLevel: profile.experienceLevel || null,
      daysPerWeek: profile.daysPerWeek || null,
      preferredHours: profile.preferredHours || null,
      aiSummary: profile.aiSummary || null,
      rawConversation: conversation as unknown as Prisma.InputJsonValue,
    },
  })

  return NextResponse.json({ ok: true })
}
