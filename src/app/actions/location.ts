"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

function parseSchedule(raw: FormDataEntryValue | null): object[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (Array.isArray(parsed)) return parsed as object[];
    return [];
  } catch {
    return [];
  }
}

function parseAmenities(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createLocationAction(formData: FormData) {
  await requireAdmin();

  await prisma.location.create({
    data: {
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      city: formData.get("city") ? String(formData.get("city")) : null,
      county: formData.get("county") ? String(formData.get("county")) : null,
      postalCode: formData.get("postalCode") ? String(formData.get("postalCode")) : null,
      address: formData.get("address") ? String(formData.get("address")) : null,
      phone: formData.get("phone") ? String(formData.get("phone")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      lat: formData.get("lat") ? Number(formData.get("lat")) : null,
      lng: formData.get("lng") ? Number(formData.get("lng")) : null,
      photo: formData.get("photo") ? String(formData.get("photo")) : null,
      amenities: parseAmenities(formData.get("amenities")),
      schedule: parseSchedule(formData.get("schedule")),
      isActive: formData.get("isActive") === "true",
      sortOrder: formData.get("sortOrder") ? Number(formData.get("sortOrder")) : 0,
    },
  });

  revalidatePath("/admin/locatii");
  revalidatePath("/locatii");
  revalidatePath("/antrenori");
}

export async function updateLocationAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  await prisma.location.update({
    where: { id },
    data: {
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      city: formData.get("city") ? String(formData.get("city")) : null,
      county: formData.get("county") ? String(formData.get("county")) : null,
      postalCode: formData.get("postalCode") ? String(formData.get("postalCode")) : null,
      address: formData.get("address") ? String(formData.get("address")) : null,
      phone: formData.get("phone") ? String(formData.get("phone")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      lat: formData.get("lat") ? Number(formData.get("lat")) : null,
      lng: formData.get("lng") ? Number(formData.get("lng")) : null,
      photo: formData.get("photo") ? String(formData.get("photo")) : null,
      amenities: parseAmenities(formData.get("amenities")),
      schedule: parseSchedule(formData.get("schedule")),
      isActive: formData.get("isActive") === "true",
      sortOrder: formData.get("sortOrder") ? Number(formData.get("sortOrder")) : 0,
    },
  });

  revalidatePath("/admin/locatii");
  revalidatePath("/locatii");
  revalidatePath("/antrenori");
}

export async function deleteLocationAction(id: number) {
  await requireAdmin();
  await prisma.location.delete({ where: { id } });
  revalidatePath("/admin/locatii");
  revalidatePath("/locatii");
  revalidatePath("/antrenori");
}

export async function toggleLocationActiveAction(id: number, isActive: boolean) {
  await requireAdmin();
  await prisma.location.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/locatii");
  revalidatePath("/locatii");
  revalidatePath("/antrenori");
}
