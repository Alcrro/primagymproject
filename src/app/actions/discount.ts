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

function parseOptionalFloat(value: FormDataEntryValue | null): number | null {
  if (!value || String(value).trim() === "") return null;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? null : parsed;
}

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (!value || String(value).trim() === "") return null;
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? null : parsed;
}

function parseOptionalDate(value: FormDataEntryValue | null): Date | null {
  if (!value || String(value).trim() === "") return null;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}

export async function createDiscountAction(
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Codul este obligatoriu." };

  const discountType = String(formData.get("discountType") ?? "");
  const discountPct =
    discountType === "pct" ? parseOptionalFloat(formData.get("discountValue")) : null;
  const discountRon =
    discountType === "ron" ? parseOptionalFloat(formData.get("discountValue")) : null;

  const validFrom = parseOptionalDate(formData.get("validFrom"));
  const validUntil = parseOptionalDate(formData.get("validUntil"));
  const maxUses = parseOptionalInt(formData.get("maxUses"));
  const isActive = formData.get("isActive") === "true";

  try {
    await prisma.discountCode.create({
      data: {
        code,
        discountPct: discountPct !== null ? discountPct : undefined,
        discountRon: discountRon !== null ? discountRon : undefined,
        validFrom,
        validUntil,
        maxUses,
        isActive,
      },
    });
  } catch {
    return { error: "Codul există deja sau a apărut o eroare." };
  }

  revalidatePath("/admin/discounturi");
  return {};
}

export async function updateDiscountAction(
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();

  const id = parseInt(String(formData.get("id") ?? ""), 10);
  if (isNaN(id)) return { error: "ID invalid." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Codul este obligatoriu." };

  const discountType = String(formData.get("discountType") ?? "");
  const discountPct =
    discountType === "pct" ? parseOptionalFloat(formData.get("discountValue")) : null;
  const discountRon =
    discountType === "ron" ? parseOptionalFloat(formData.get("discountValue")) : null;

  const validFrom = parseOptionalDate(formData.get("validFrom"));
  const validUntil = parseOptionalDate(formData.get("validUntil"));
  const maxUses = parseOptionalInt(formData.get("maxUses"));
  const isActive = formData.get("isActive") === "true";

  try {
    await prisma.discountCode.update({
      where: { id },
      data: {
        code,
        discountPct,
        discountRon,
        validFrom,
        validUntil,
        maxUses,
        isActive,
      },
    });
  } catch {
    return { error: "Codul există deja sau a apărut o eroare." };
  }

  revalidatePath("/admin/discounturi");
  return {};
}

export async function deleteDiscountAction(id: number): Promise<void> {
  await requireAdmin();

  await prisma.discountCode.delete({ where: { id } });

  revalidatePath("/admin/discounturi");
}

export async function applyDiscountCodeAction(
  code: string,
  subtotal: number
): Promise<{ discountRon: number; error?: string }> {
  if (!code.trim()) return { discountRon: 0, error: "Introdu un cod de reducere." };

  const discount = await prisma.discountCode.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!discount || !discount.isActive) {
    return { discountRon: 0, error: "Cod invalid sau expirat." };
  }

  const now = new Date();
  if (discount.validFrom && discount.validFrom > now) {
    return { discountRon: 0, error: "Codul nu este încă activ." };
  }
  if (discount.validUntil && discount.validUntil < now) {
    return { discountRon: 0, error: "Codul a expirat." };
  }
  if (discount.maxUses !== null && discount.currentUses >= discount.maxUses) {
    return { discountRon: 0, error: "Codul a atins limita de utilizări." };
  }

  let discountRon = 0;
  if (discount.discountRon) {
    discountRon = Math.min(Number(discount.discountRon), subtotal);
  } else if (discount.discountPct) {
    discountRon = Math.round((subtotal * Number(discount.discountPct)) / 100 * 100) / 100;
  }

  return { discountRon };
}

export async function toggleDiscountActiveAction(
  id: number,
  isActive: boolean
): Promise<void> {
  await requireAdmin();

  await prisma.discountCode.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/discounturi");
}
