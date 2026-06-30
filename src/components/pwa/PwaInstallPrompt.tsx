"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./PwaInstallPrompt.module.scss"

interface IBeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<IBeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as IBeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  async function installHandler() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") setVisible(false)
    setDeferredPrompt(null)
  }

  function dismissHandler() {
    setVisible(false)
    setDeferredPrompt(null)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="banner">
      <div className={styles.icon}>
        <Image src="/icons/icon-72x72.png" alt="ApexFit" width={40} height={40} />
      </div>
      <div className={styles.text}>
        <span className={styles.title}>Instalează ApexFit</span>
        <span className={styles.sub}>Acces rapid de pe ecranul principal</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnInstall} onClick={installHandler}>
          Instalează
        </button>
        <button className={styles.btnDismiss} onClick={dismissHandler} aria-label="Închide">
          ✕
        </button>
      </div>
    </div>
  )
}
