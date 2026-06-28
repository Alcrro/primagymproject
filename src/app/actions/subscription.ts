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

export async function updatePlanPriceAction(id: number, priceRon: string): Promise<void> {
  await requireAdmin();

  const parsed = parseFloat(priceRon);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error("Preț invalid");
  }

  await prisma.subscriptionPlan.update({
    where: { id },
    data: { priceRon: parsed },
  });

  revalidatePath("/admin/abonamente");
  revalidatePath("/abonamente");
}

export async function togglePlanActiveAction(id: number, isActive: boolean): Promise<void> {
  await requireAdmin();

  await prisma.subscriptionPlan.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/abonamente");
  revalidatePath("/abonamente");
}

export async function toggleCategoryActiveAction(id: number, isActive: boolean): Promise<void> {
  await requireAdmin();

  await prisma.subscriptionCategory.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/abonamente");
  revalidatePath("/abonamente");
}
