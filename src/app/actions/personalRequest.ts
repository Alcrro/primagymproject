"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Neautentificat.");
  return session.user;
}

export async function sendPersonalRequestAction(formData: FormData) {
  const user = await requireAuth();

  const trainerId = Number(formData.get("trainerId"));
  const requestedAt = new Date(String(formData.get("requestedAt")));
  const message = formData.get("message") ? String(formData.get("message")) : null;

  const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
  if (!trainer || !trainer.isActive) return { error: "Antrenorul nu este disponibil." };

  // Validare abonament activ
  const activeOrder = await prisma.orderItem.findFirst({
    where: {
      order: { userId: user.id, status: "PAID" },
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  if (!activeOrder) {
    return { error: "Ai nevoie de un abonament activ pentru a solicita o ședință personală.", redirect: "/abonamente" };
  }

  await prisma.personalRequest.create({
    data: { memberId: user.id, trainerId, requestedAt, message },
  });

  revalidatePath("/rezervari");
  return { success: true };
}

export async function respondPersonalRequestAction(formData: FormData) {
  const user = await requireAuth();
  if (user.role !== "TRAINER" && user.role !== "ADMIN") throw new Error("Unauthorized");

  const trainer = await prisma.trainer.findUnique({ where: { userId: user.id } });
  if (!trainer) throw new Error("Profil antrenor negăsit.");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as "ACCEPTED" | "REJECTED";
  const responseNote = formData.get("responseNote") ? String(formData.get("responseNote")) : null;

  const request = await prisma.personalRequest.findFirst({ where: { id, trainerId: trainer.id } });
  if (!request) throw new Error("Cererea nu există sau nu îți aparține.");

  await prisma.personalRequest.update({
    where: { id },
    data: { status, responseNote },
  });

  revalidatePath("/trainer/cereri");
}

export async function cancelPersonalRequestAction(id: number) {
  const user = await requireAuth();

  await prisma.personalRequest.update({
    where: { id, memberId: user.id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/rezervari");
}
