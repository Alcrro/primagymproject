"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateNameAction(
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Neautentificat" }

  const name = (formData.get("name") as string)?.trim()

  if (!name || name.length < 2) return { error: "Numele trebuie să aibă cel puțin 2 caractere." }
  if (name.length > 50) return { error: "Numele poate avea maxim 50 de caractere." }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  })

  revalidatePath("/profil")
  return { error: null }
}
