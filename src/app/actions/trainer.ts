"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TRAINER")) {
    throw new Error("Unauthorized");
  }
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createTrainerAction(formData: FormData) {
  await requireAdmin();

  const classes = formData.getAll("classes") as string[];
  const locationId = formData.get("locationId");

  await prisma.trainer.create({
    data: {
      name: String(formData.get("name") ?? ""),
      age: formData.get("age") ? Number(formData.get("age")) : null,
      category: String(formData.get("category") ?? ""),
      classes,
      specializations: parseTags(formData.get("specializations")),
      certifications: parseTags(formData.get("certifications")),
      description: formData.get("description") ? String(formData.get("description")) : null,
      bio: formData.get("bio") ? String(formData.get("bio")) : null,
      instagram: formData.get("instagram") ? String(formData.get("instagram")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      thumbnail: formData.get("thumbnail") ? String(formData.get("thumbnail")) : null,
      teachingStyle: formData.get("teachingStyle") ? String(formData.get("teachingStyle")) : null,
      avoidedApproaches: formData.get("avoidedApproaches") ? String(formData.get("avoidedApproaches")) : null,
      locationId: locationId ? Number(locationId) : null,
      sortOrder: formData.get("sortOrder") ? Number(formData.get("sortOrder")) : 0,
    },
  });

  revalidatePath("/admin/antrenori");
  revalidatePath("/antrenori");
}

export async function updateTrainerAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const classes = formData.getAll("classes") as string[];
  const locationId = formData.get("locationId");

  await prisma.trainer.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      age: formData.get("age") ? Number(formData.get("age")) : null,
      category: String(formData.get("category") ?? ""),
      classes,
      specializations: parseTags(formData.get("specializations")),
      certifications: parseTags(formData.get("certifications")),
      description: formData.get("description") ? String(formData.get("description")) : null,
      bio: formData.get("bio") ? String(formData.get("bio")) : null,
      instagram: formData.get("instagram") ? String(formData.get("instagram")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      thumbnail: formData.get("thumbnail") ? String(formData.get("thumbnail")) : null,
      teachingStyle: formData.get("teachingStyle") ? String(formData.get("teachingStyle")) : null,
      avoidedApproaches: formData.get("avoidedApproaches") ? String(formData.get("avoidedApproaches")) : null,
      locationId: locationId ? Number(locationId) : null,
      sortOrder: formData.get("sortOrder") ? Number(formData.get("sortOrder")) : 0,
    },
  });

  revalidatePath("/admin/antrenori");
  revalidatePath("/antrenori");
}

export async function deleteTrainerAction(id: number) {
  await requireAdmin();
  await prisma.trainer.delete({ where: { id } });
  revalidatePath("/admin/antrenori");
  revalidatePath("/antrenori");
}

export async function toggleTrainerActiveAction(id: number, isActive: boolean) {
  await requireAdmin();
  await prisma.trainer.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/antrenori");
  revalidatePath("/antrenori");
}
