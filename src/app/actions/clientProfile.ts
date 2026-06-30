"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface IIntakeFormData {
  reason: string
  fitnessGoal: string
  experienceLevel: string
  daysPerWeek: number
  preferredHours: string
  injuries: string
  medicalRestrictions: string
}

export async function saveIntakeFormAction(data: IIntakeFormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Neautentificat")
  const userId = session.user.id

  const summary = [
    data.reason && `Motiv: ${data.reason}.`,
    data.fitnessGoal && `Obiectiv principal: ${data.fitnessGoal}.`,
    data.experienceLevel && `Nivel experiență: ${data.experienceLevel}.`,
    data.daysPerWeek && `Disponibil ${data.daysPerWeek} zile/săptămână${data.preferredHours ? `, ${data.preferredHours}` : ""}.`,
    data.injuries && `Accidentări: ${data.injuries}.`,
    data.medicalRestrictions && `Restricții: ${data.medicalRestrictions}.`,
  ].filter(Boolean).join(" ")

  await prisma.clientProfile.upsert({
    where: { userId },
    create: {
      userId,
      reason: data.reason || null,
      fitnessGoal: data.fitnessGoal || null,
      experienceLevel: data.experienceLevel || null,
      daysPerWeek: data.daysPerWeek || null,
      preferredHours: data.preferredHours || null,
      injuries: data.injuries || null,
      medicalRestrictions: data.medicalRestrictions || null,
      aiSummary: summary || null,
    },
    update: {
      reason: data.reason || null,
      fitnessGoal: data.fitnessGoal || null,
      experienceLevel: data.experienceLevel || null,
      daysPerWeek: data.daysPerWeek || null,
      preferredHours: data.preferredHours || null,
      injuries: data.injuries || null,
      medicalRestrictions: data.medicalRestrictions || null,
      aiSummary: summary || null,
    },
  })

  revalidatePath("/profil/fisa")
  revalidatePath("/profil")
}

export async function saveCommunicationStyleAction(style: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Neautentificat")
  const userId = session.user.id

  await prisma.clientProfile.upsert({
    where: { userId },
    create: { userId, communicationStyle: style },
    update: { communicationStyle: style },
  })

  revalidatePath("/profil/fisa")
}

export async function saveTrainerNotesAction(userId: string, notes: string) {
  const session = await auth()
  const role = session?.user?.role
  if (role !== "TRAINER" && role !== "ADMIN") {
    throw new Error("Acces interzis")
  }

  await prisma.clientProfile.update({
    where: { userId },
    data: { trainerNotes: notes.trim() || null },
  })

  revalidatePath(`/profil/${userId}`)
}
