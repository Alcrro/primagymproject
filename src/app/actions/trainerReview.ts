"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitTrainerReviewAction(
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await auth();
  if (!session || session.user.role !== "MEMBER") {
    return { error: "Trebuie să fii autentificat ca membru pentru a lăsa un review." };
  }

  const trainerId = Number(formData.get("trainerId"));
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") ? String(formData.get("comment")).trim() : null;

  if (!trainerId || rating < 1 || rating > 5) {
    return { error: "Date invalide." };
  }

  const existing = await prisma.trainerReview.findUnique({
    where: { trainerId_userId: { trainerId, userId: session.user.id! } },
  });
  if (existing) {
    return { error: "Ai lăsat deja un review pentru acest antrenor." };
  }

  await prisma.trainerReview.create({
    data: {
      trainerId,
      userId: session.user.id!,
      rating,
      comment: comment || null,
    },
  });

  revalidatePath("/antrenori", "layout");
  return { error: null };
}

export async function deleteTrainerReviewAction(reviewId: number): Promise<void> {
  const session = await auth();
  if (!session) return;

  const review = await prisma.trainerReview.findUnique({ where: { id: reviewId } });
  if (!review) return;

  const isSelf = review.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isSelf && !isAdmin) return;

  await prisma.trainerReview.delete({ where: { id: reviewId } });
  revalidatePath("/antrenori", "layout");
}
