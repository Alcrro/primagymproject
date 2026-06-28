"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
}

export async function addGalleryPhotoAction(
  formData: FormData
): Promise<{ error: string | null }> {
  await requireAdmin()

  const url = (formData.get("url") as string)?.trim()
  const altText = (formData.get("altText") as string)?.trim() || null

  if (!url) return { error: "URL-ul este obligatoriu." }

  const filename = url.split("/").pop() ?? url
  const max = await prisma.galleryPhoto.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (max._max.sortOrder ?? 0) + 1

  await prisma.galleryPhoto.create({ data: { url, filename, altText, sortOrder } })

  revalidatePath("/admin/galerie")
  revalidatePath("/galerie")
  return { error: null }
}

export async function deleteGalleryPhotoAction(id: number) {
  await requireAdmin()
  await prisma.galleryPhoto.delete({ where: { id } })
  revalidatePath("/admin/galerie")
  revalidatePath("/galerie")
}

export async function toggleGalleryPhotoActiveAction(id: number, isActive: boolean) {
  await requireAdmin()
  await prisma.galleryPhoto.update({ where: { id }, data: { isActive } })
  revalidatePath("/admin/galerie")
  revalidatePath("/galerie")
}
