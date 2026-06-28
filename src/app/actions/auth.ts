"use server"

import { signIn, signOut, auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { randomUUID } from "crypto"
import { Resend } from "resend"
import type { IRegisterCredentials } from "@/types/auth"

const FROM_EMAIL = "ApexFit <noreply@apexfit.ro>"

function buildVerificationEmail(name: string | null, link: string): string {
  return `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:560px;width:100%">
        <tr><td style="background:#FF5C00;padding:28px 32px">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">ApexFit</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Confirmă adresa de email</p>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 20px;font-size:16px;color:#111">Bună${name ? ` ${name}` : ""}!</p>
          <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.6">
            Apasă butonul de mai jos pentru a-ți confirma adresa de email și a activa contul ApexFit.
          </p>
          <a href="${link}"
             style="display:inline-block;padding:14px 32px;background:#FF5C00;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px">
            Confirmă adresa de email
          </a>
          <p style="margin:20px 0 0;font-size:13px;color:#888;line-height:1.6">
            Sau copiază acest link în browser:<br>
            <span style="color:#FF5C00;word-break:break-all">${link}</span>
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#aaa">Linkul este valabil 24 de ore.</p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#fafafa;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#999">© ${new Date().getFullYear()} ApexFit. Toate drepturile rezervate.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

async function sendVerificationEmail(email: string, name: string | null): Promise<void> {
  const token = randomUUID()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.verificationToken.deleteMany({ where: { identifier: email } })
  await prisma.verificationToken.create({ data: { identifier: email, token, expires } })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://apexfit.ro"
  const link = `${baseUrl}/verificare-email/${token}`

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails
    .send({
      from: FROM_EMAIL,
      to: email,
      subject: "Confirmă adresa de email — ApexFit",
      html: buildVerificationEmail(name, link),
    })
    .catch(() => {})
}

export async function loginWithCredentials(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = formData.get("callbackUrl") as string | null

  try {
    await signIn("credentials", { email, password, redirect: false })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email sau parolă incorectă" }
    }
    return { error: "Autentificarea a eșuat. Încearcă din nou." }
  }

  redirect(callbackUrl || "/profil")
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/profil" })
}

export async function loginWithFacebook() {
  await signIn("facebook", { redirectTo: "/profil" })
}

export async function loginWithTikTok() {
  await signIn("tiktok", { redirectTo: "/profil" })
}

export async function registerUser(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const data: IRegisterCredentials = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  if (data.password !== data.confirmPassword) {
    return { error: "Parolele nu coincid", success: false }
  }

  if (data.password.length < 8) {
    return { error: "Parola trebuie să aibă minim 8 caractere", success: false }
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    return { error: "Există deja un cont cu acest email", success: false }
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  })

  await sendVerificationEmail(user.email!, user.name)

  return { error: null, success: true }
}

export async function resendVerificationEmailAction(): Promise<{ error: string | null; success: boolean }> {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: "Nu ești autentificat", success: false }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { emailVerified: true, name: true },
  })

  if (user?.emailVerified) {
    return { error: null, success: true }
  }

  await sendVerificationEmail(session.user.email, session.user.name ?? null)
  return { error: null, success: true }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}
