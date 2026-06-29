import type { DefaultSession } from "next-auth"

export type UserRole = "MEMBER" | "TRAINER" | "ADMIN" | "HR_MANAGER"

export interface IAuthUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: UserRole
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IRegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface IForgotPasswordPayload {
  email: string
}

export interface IResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

declare module "next-auth" {
  interface User {
    role?: UserRole
  }
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }
}

