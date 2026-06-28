import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email-ul este obligatoriu" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  // Răspundem mereu cu succes pentru securitate (nu dezvăluim dacă emailul există)
  if (!user) {
    return NextResponse.json({ success: true })
  }

  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 oră

  const resetToken = await prisma.passwordResetToken.create({
    data: { userId: user.id, expires },
  })

  const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${resetToken.token}`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@apexfit.ro",
    to: email,
    subject: "Resetare parolă ApexFit",
    html: `
      <p>Ai solicitat resetarea parolei pentru contul tău ApexFit.</p>
      <p>
        <a href="${resetUrl}" style="background:#FF5C00;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
          Resetează parola
        </a>
      </p>
      <p>Link-ul este valabil 1 oră. Dacă nu ai solicitat resetarea, ignoră acest email.</p>
    `,
  })

  return NextResponse.json({ success: true })
}
