import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/profil/:path*", "/rezervari/:path*", "/admin/:path*", "/corporate/:path*"],
}
