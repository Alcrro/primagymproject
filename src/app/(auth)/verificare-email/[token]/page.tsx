import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import styles from "./verificareEmail.module.scss"

interface IVerificareEmailPageProps {
  params: { token: string }
}

export default async function VerificareEmailPage({ params }: IVerificareEmailPageProps) {
  const { token } = params

  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token },
  })

  if (!verificationToken) {
    return (
      <div className={styles.container}>
        <div className={styles.icon}>✗</div>
        <h1 className={styles.title}>Link invalid</h1>
        <p className={styles.text}>
          Acest link de confirmare nu este valid sau a fost deja folosit.
        </p>
        <Link href="/login" className={styles.btn}>
          Înapoi la autentificare
        </Link>
      </div>
    )
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { token } })

    return (
      <div className={styles.container}>
        <div className={styles.icon}>✗</div>
        <h1 className={styles.title}>Link expirat</h1>
        <p className={styles.text}>
          Linkul de confirmare a expirat. Autentifică-te în cont pentru a primi un link nou.
        </p>
        <Link href="/login" className={styles.btn}>
          Mergi la autentificare
        </Link>
      </div>
    )
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.deleteMany({
    where: { token },
  })

  redirect("/login?verified=1")
}
