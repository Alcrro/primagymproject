"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

export async function createCorporateAccount(data: {
  companyName: string
  hrManagerEmail: string
  seatsTotal: number
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  let hrUser = await prisma.user.findUnique({ where: { email: data.hrManagerEmail } })
  if (!hrUser) {
    hrUser = await prisma.user.create({
      data: {
        email: data.hrManagerEmail,
        role: "HR_MANAGER",
        name: data.companyName + " HR",
      },
    })
  } else {
    await prisma.user.update({ where: { id: hrUser.id }, data: { role: "HR_MANAGER" } })
  }

  const account = await prisma.corporateAccount.create({
    data: {
      companyName: data.companyName,
      seatsTotal: data.seatsTotal,
      hrManagerId: hrUser.id,
    },
  })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@apexfit.ro",
    to: data.hrManagerEmail,
    subject: `Contul corporate ${data.companyName} a fost activat`,
    html: `
      <p>Bună ziua,</p>
      <p>Contul corporate <strong>${data.companyName}</strong> a fost activat pe ApexFit.</p>
      <p>Ai <strong>${data.seatsTotal} locuri</strong> disponibile pentru angajați.</p>
      <p>
        <a href="${loginUrl}" style="background:#FF5C00;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
          Accesează panoul HR
        </a>
      </p>
      <p>Email: ${data.hrManagerEmail} — setează o parolă la prima autentificare.</p>
    `,
  })

  revalidatePath("/admin/corporate")
  return account
}

export async function updateCorporateAccount(
  id: string,
  data: { seatsTotal?: number; status?: "ACTIVE" | "SUSPENDED" | "CANCELLED" }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
  await prisma.corporateAccount.update({ where: { id }, data })
  revalidatePath("/admin/corporate")
  revalidatePath(`/admin/corporate/${id}`)
}

export async function inviteEmployee(corporateAccountId: string, email: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const account = await prisma.corporateAccount.findUnique({
    where: { id: corporateAccountId },
  })
  if (!account || account.hrManagerId !== session.user.id) throw new Error("Unauthorized")
  if (account.status !== "ACTIVE") throw new Error("Contul corporate nu este activ")
  if (account.seatsUsed >= account.seatsTotal) throw new Error("Nu mai sunt locuri disponibile")

  const existing = await prisma.corporateInvite.findFirst({
    where: { corporateAccountId, email, acceptedAt: null, expiresAt: { gt: new Date() } },
  })
  if (existing) throw new Error("Există deja o invitație activă pentru acest email")

  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000)
  const invite = await prisma.corporateInvite.create({
    data: { corporateAccountId, email, expiresAt },
  })

  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/invite/${invite.token}`

  if (!process.env.RESEND_API_KEY) {
    revalidatePath("/corporate/dashboard")
    return { ...invite, devUrl: inviteUrl }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@apexfit.ro",
    to: email,
    subject: `Invitație abonament sala de fitness — ${account.companyName}`,
    html: `
      <p>Bună ziua,</p>
      <p><strong>${account.companyName}</strong> ți-a oferit acces la sala de fitness ApexFit.</p>
      <p>
        <a href="${inviteUrl}" style="background:#FF5C00;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
          Activează accesul
        </a>
      </p>
      <p>Link-ul este valabil 72 de ore.</p>
    `,
  })

  revalidatePath("/corporate/dashboard")
  return invite
}

export async function bulkInviteEmployees(
  corporateAccountId: string,
  emails: string[]
): Promise<{ email: string; success: boolean; error?: string; devUrl?: string }[]> {

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const account = await prisma.corporateAccount.findUnique({
    where: { id: corporateAccountId },
  })
  if (!account || account.hrManagerId !== session.user.id) throw new Error("Unauthorized")
  if (account.status !== "ACTIVE") throw new Error("Contul corporate nu este activ")

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  const results: { email: string; success: boolean; error?: string; devUrl?: string }[] = []

  let seatsUsed = account.seatsUsed

  for (const email of emails) {
    if (seatsUsed >= account.seatsTotal) {
      results.push({ email, success: false, error: "Nu mai sunt locuri disponibile" })
      continue
    }

    const existing = await prisma.corporateInvite.findFirst({
      where: { corporateAccountId, email, acceptedAt: null, expiresAt: { gt: new Date() } },
    })
    if (existing) {
      results.push({ email, success: false, error: "Invitație deja activă" })
      continue
    }

    const alreadyMember = await prisma.corporateMember.findFirst({
      where: {
        corporateAccountId,
        revokedAt: null,
        user: { email },
      },
    })
    if (alreadyMember) {
      results.push({ email, success: false, error: "Deja membru activ" })
      continue
    }

    try {
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000)
      const invite = await prisma.corporateInvite.create({
        data: { corporateAccountId, email, expiresAt },
      })
      const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/invite/${invite.token}`
      if (!resend) {
        seatsUsed++
        results.push({ email, success: true, devUrl: inviteUrl })
      } else {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "noreply@apexfit.ro",
          to: email,
          subject: `Invitație abonament sala de fitness — ${account.companyName}`,
          html: `
            <p>Bună ziua,</p>
            <p><strong>${account.companyName}</strong> ți-a oferit acces la sala de fitness ApexFit.</p>
            <p>
              <a href="${inviteUrl}" style="background:#FF5C00;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
                Activează accesul
              </a>
            </p>
            <p>Link-ul este valabil 72 de ore.</p>
          `,
        })
        seatsUsed++
        results.push({ email, success: true })
      }
    } catch {
      results.push({ email, success: false, error: "Eroare la trimitere" })
    }
  }

  revalidatePath("/corporate/dashboard")
  return results
}

export async function revokeEmployee(memberId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const member = await prisma.corporateMember.findUnique({
    where: { id: memberId },
    include: { corporateAccount: true },
  })
  if (!member) throw new Error("Membrul nu există")
  if (member.corporateAccount.hrManagerId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
  if (member.revokedAt) throw new Error("Accesul a fost deja revocat")

  await prisma.$transaction([
    prisma.corporateMember.update({
      where: { id: memberId },
      data: { revokedAt: new Date() },
    }),
    prisma.corporateAccount.update({
      where: { id: member.corporateAccountId },
      data: { seatsUsed: { decrement: 1 } },
    }),
  ])

  revalidatePath("/corporate/dashboard")
}

export async function acceptCorporateInvite(token: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Autentificare necesară")

  const invite = await prisma.corporateInvite.findUnique({ where: { token } })
  if (!invite) throw new Error("Invitație invalidă")
  if (invite.acceptedAt) throw new Error("Invitația a fost deja folosită")
  if (invite.expiresAt < new Date()) throw new Error("Invitația a expirat")

  const account = await prisma.corporateAccount.findUnique({
    where: { id: invite.corporateAccountId },
  })
  if (!account || account.status !== "ACTIVE") throw new Error("Contul corporate nu este activ")
  if (account.seatsUsed >= account.seatsTotal) throw new Error("Nu mai sunt locuri disponibile")

  const existingMember = await prisma.corporateMember.findFirst({
    where: { corporateAccountId: invite.corporateAccountId, userId: session.user.id, revokedAt: null },
  })
  if (existingMember) throw new Error("Ești deja membru în acest cont corporate")

  await prisma.$transaction([
    prisma.corporateInvite.update({
      where: { token },
      data: { acceptedAt: new Date() },
    }),
    prisma.corporateMember.create({
      data: { corporateAccountId: invite.corporateAccountId, userId: session.user.id },
    }),
    prisma.corporateAccount.update({
      where: { id: invite.corporateAccountId },
      data: { seatsUsed: { increment: 1 } },
    }),
  ])

  revalidatePath("/corporate/dashboard")
  revalidatePath("/profil")
}
