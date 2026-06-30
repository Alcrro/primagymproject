import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import AiIntakeModalWrapper from "./AiIntakeModalWrapper"

export default async function AiIntakeGate() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "MEMBER") return null

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (profile) return null

  const hasAI = !!process.env.OPENAI_API_KEY

  return <AiIntakeModalWrapper hasAI={hasAI} />
}
