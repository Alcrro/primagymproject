import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    session({ session, token }) {
      if (token) {
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as { role?: string })?.role

      if (
        nextUrl.pathname.startsWith("/admin/scan") ||
        nextUrl.pathname.startsWith("/admin/check-ins")
      ) {
        return isLoggedIn && (role === "ADMIN" || role === "TRAINER")
      }

      if (nextUrl.pathname.startsWith("/admin")) {
        return isLoggedIn && role === "ADMIN"
      }

      if (
        nextUrl.pathname.startsWith("/profil") ||
        nextUrl.pathname.startsWith("/rezervari")
      ) {
        return isLoggedIn
      }

      return true
    },
  },
  providers: [],
}
