import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  }

  const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

  const token = await new SignJWT({ userId: session.user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5m")
    .setIssuedAt()
    .sign(secret)

  return NextResponse.json({ token })
}
