import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return NextResponse.json({ error: "Date incomplete" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Parola trebuie să aibă minim 8 caractere" },
      { status: 400 }
    )
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!resetToken) {
    return NextResponse.json({ error: "Token invalid sau expirat" }, { status: 400 })
  }

  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } })
    return NextResponse.json({ error: "Token-ul a expirat. Solicită un nou link." }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  })

  await prisma.passwordResetToken.delete({ where: { token } })

  return NextResponse.json({ success: true })
}
