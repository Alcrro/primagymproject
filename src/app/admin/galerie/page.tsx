import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminGalleryPage from "@/components/admin/galerie/AdminGalleryPage"

export default async function AdminGaleriePage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/admin")

  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { sortOrder: "asc" },
  })

  return <AdminGalleryPage photos={photos} />
}
