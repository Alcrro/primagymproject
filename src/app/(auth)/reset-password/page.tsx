import ResetPasswordForm from "@/components/auth/resetPasswordForm/ResetPasswordForm"

interface IResetPasswordPageProps {
  searchParams: { token?: string }
}

export default function ResetPasswordPage({ searchParams }: IResetPasswordPageProps) {
  return <ResetPasswordForm token={searchParams.token ?? ""} />
}
