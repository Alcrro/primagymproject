import LoginForm from "@/components/auth/loginForm/LoginForm"

interface ILoginPageProps {
  searchParams: { callbackUrl?: string; error?: string; verified?: string }
}

export default function LoginPage({ searchParams }: ILoginPageProps) {
  return (
    <LoginForm
      callbackUrl={searchParams.callbackUrl}
      oauthError={searchParams.error}
      verified={searchParams.verified === "1"}
    />
  )
}
