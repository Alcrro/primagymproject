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

      if (nextUrl.pathname.startsWith("/rezervari")) {
        return isLoggedIn
      }

      if (nextUrl.pathname.startsWith("/profil")) {
        const protectedSubRoutes = new Set(['statistici', 'abonamente', 'setari'])
        const segments = nextUrl.pathname.slice(1).split('/')
        // /profil/[userId] — public profile page
        if (segments.length === 2 && segments[1] && !protectedSubRoutes.has(segments[1])) {
          return true
        }
        return isLoggedIn
      }

      return true
    },
  },
  providers: [],
}
