import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import FisaClientPage from "@/components/profil/fisa/FisaClientPage"

export const metadata = { title: "Fișa mea" }

export default async function FisaPage() {
  const session = await auth()
  const userId = session!.user.id

  const profile = await prisma.clientProfile.findUnique({ where: { userId } })
  const hasAI = !!process.env.OPENAI_API_KEY

  return <FisaClientPage profile={profile} hasAI={hasAI} />
}
