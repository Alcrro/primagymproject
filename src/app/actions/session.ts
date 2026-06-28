"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@apexfit.ro";

const CATEGORY_LABELS: Record<string, string> = {
  zumba: "Zumba", aerobic: "Aerobic", cycling: "Cycling", fitness: "Fitness",
};

function fmtDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

async function getTrainerOrThrow(userId: string) {
  const trainer = await prisma.trainer.findUnique({ where: { userId } });
  if (!trainer) throw new Error("Nu ai un profil de antrenor asociat.");
  return trainer;
}

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Neautentificat.");
  return session.user;
}

export async function createSessionAction(formData: FormData) {
  const user = await requireAuth();
  if (user.role !== "TRAINER" && user.role !== "ADMIN") throw new Error("Unauthorized");

  const trainer = await getTrainerOrThrow(user.id);

  await prisma.classSession.create({
    data: {
      trainerId: trainer.id,
      locationId: formData.get("locationId") ? Number(formData.get("locationId")) : null,
      categorySlug: String(formData.get("categorySlug") ?? ""),
      startAt: new Date(String(formData.get("startAt"))),
      durationMinutes: Number(formData.get("durationMinutes") ?? 60),
      maxCapacity: Number(formData.get("maxCapacity") ?? 20),
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });

  revalidatePath("/trainer/sesiuni");
  revalidatePath("/sesiuni");
}

export async function updateSessionAction(formData: FormData) {
  const user = await requireAuth();
  if (user.role !== "TRAINER" && user.role !== "ADMIN") throw new Error("Unauthorized");

  const trainer = await getTrainerOrThrow(user.id);
  const id = Number(formData.get("id"));

  const existing = await prisma.classSession.findFirst({ where: { id, trainerId: trainer.id } });
  if (!existing) throw new Error("Sesiunea nu există sau nu îți aparține.");

  await prisma.classSession.update({
    where: { id },
    data: {
      locationId: formData.get("locationId") ? Number(formData.get("locationId")) : null,
      categorySlug: String(formData.get("categorySlug") ?? ""),
      startAt: new Date(String(formData.get("startAt"))),
      durationMinutes: Number(formData.get("durationMinutes") ?? 60),
      maxCapacity: Number(formData.get("maxCapacity") ?? 20),
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });

  revalidatePath("/trainer/sesiuni");
  revalidatePath("/sesiuni");
}

export async function cancelSessionAction(id: number) {
  const user = await requireAuth();
  if (user.role !== "TRAINER" && user.role !== "ADMIN") throw new Error("Unauthorized");

  const trainer = await getTrainerOrThrow(user.id);
  const existing = await prisma.classSession.findFirst({ where: { id, trainerId: trainer.id } });
  if (!existing) throw new Error("Sesiunea nu există sau nu îți aparține.");

  await prisma.classSession.update({ where: { id }, data: { status: "CANCELLED" } });

  revalidatePath("/trainer/sesiuni");
  revalidatePath("/sesiuni");
}

export async function bookSessionAction(sessionId: number) {
  const user = await requireAuth();

  const session = await prisma.classSession.findUnique({
    where: { id: sessionId },
    include: {
      trainer: { select: { name: true } },
      _count: { select: { bookings: { where: { status: "CONFIRMED" } } } },
    },
  });

  if (!session || session.status !== "SCHEDULED") {
    return { error: "Sesiunea nu este disponibilă." };
  }

  if (session._count.bookings >= session.maxCapacity) {
    return { error: "Sesiunea este completă." };
  }

  const existing = await prisma.classBooking.findUnique({
    where: { sessionId_userId: { sessionId, userId: user.id } },
  });
  if (existing && existing.status === "CONFIRMED") {
    return { error: "Ai deja o rezervare la această sesiune." };
  }

  const activeOrder = await prisma.orderItem.findFirst({
    where: {
      order: { userId: user.id, status: "PAID" },
      categoryName: { equals: session.categorySlug, mode: "insensitive" },
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  if (!activeOrder) {
    return { error: "Nu ai un abonament activ pentru această categorie.", redirect: `/abonamente/${session.categorySlug}` };
  }

  if (existing) {
    await prisma.classBooking.update({
      where: { sessionId_userId: { sessionId, userId: user.id } },
      data: { status: "CONFIRMED" },
    });
  } else {
    await prisma.classBooking.create({
      data: { sessionId, userId: user.id },
    });
  }

  revalidatePath(`/sesiuni/${sessionId}`);
  revalidatePath("/rezervari");

  if (user.email) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const categoryLabel = CATEGORY_LABELS[session.categorySlug] ?? session.categorySlug;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Rezervare confirmată — ${categoryLabel} · ApexFit`,
      html: `
        <p>Salut${user.name ? ` ${user.name}` : ""},</p>
        <p>Rezervarea ta a fost confirmată!</p>
        <table style="border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Categorie</td><td style="font-weight:700;">${categoryLabel}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Data</td><td>${fmtDate(session.startAt)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Durată</td><td>${session.durationMinutes} minute</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Antrenor</td><td>${session.trainer.name}</td></tr>
        </table>
        <p>Ne vedem la sală!</p>
        <p style="color:#6b7280;font-size:0.85rem;">ApexFit · Poți anula rezervarea din <a href="${process.env.AUTH_URL}/rezervari">profilul tău</a>.</p>
      `,
    }).catch(() => {});
  }

  return { success: true };
}

export async function adminCreateSessionAction(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.classSession.create({
    data: {
      trainerId: Number(formData.get("trainerId")),
      locationId: formData.get("locationId") ? Number(formData.get("locationId")) : null,
      categorySlug: String(formData.get("categorySlug") ?? ""),
      startAt: new Date(String(formData.get("startAt"))),
      durationMinutes: Number(formData.get("durationMinutes") ?? 60),
      maxCapacity: Number(formData.get("maxCapacity") ?? 20),
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });

  revalidatePath("/admin/sesiuni");
  revalidatePath("/sesiuni");
  revalidatePath("/trainer/sesiuni");
}

export async function adminUpdateSessionAction(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const id = Number(formData.get("id"));

  await prisma.classSession.update({
    where: { id },
    data: {
      trainerId: Number(formData.get("trainerId")),
      locationId: formData.get("locationId") ? Number(formData.get("locationId")) : null,
      categorySlug: String(formData.get("categorySlug") ?? ""),
      startAt: new Date(String(formData.get("startAt"))),
      durationMinutes: Number(formData.get("durationMinutes") ?? 60),
      maxCapacity: Number(formData.get("maxCapacity") ?? 20),
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });

  revalidatePath("/admin/sesiuni");
  revalidatePath("/sesiuni");
  revalidatePath("/trainer/sesiuni");
}

export async function cancelBookingAction(sessionId: number) {
  const user = await requireAuth();

  const session = await prisma.classSession.findUnique({
    where: { id: sessionId },
    include: { trainer: { select: { name: true } } },
  });

  await prisma.classBooking.update({
    where: { sessionId_userId: { sessionId, userId: user.id } },
    data: { status: "CANCELLED" },
  });

  revalidatePath(`/sesiuni/${sessionId}`);
  revalidatePath("/rezervari");

  if (user.email && session) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const categoryLabel = CATEGORY_LABELS[session.categorySlug] ?? session.categorySlug;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Rezervare anulată — ${categoryLabel} · ApexFit`,
      html: `
        <p>Salut${user.name ? ` ${user.name}` : ""},</p>
        <p>Rezervarea ta la sesiunea de <strong>${categoryLabel}</strong> din <strong>${fmtDate(session.startAt)}</strong> a fost anulată.</p>
        <p>Poți face o nouă rezervare oricând din <a href="${process.env.AUTH_URL}/sesiuni">pagina sesiunilor</a>.</p>
        <p style="color:#6b7280;font-size:0.85rem;">ApexFit</p>
      `,
    }).catch(() => {});
  }
}
