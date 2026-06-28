"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser"
import { Result } from "@zxing/library"
import { IMemberData, IActiveSub } from "@/types/qr"
import MemberCard from "@/components/admin/MemberCard"
import styles from "@/components/admin/scanner.module.scss"

type ScanState = "idle" | "scanning" | "loading" | "success" | "error"

interface VerifyResponse extends IMemberData {
  error?: string
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserQRCodeReader | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)

  const [scanState, setScanState] = useState<ScanState>("idle")
  const [member, setMember] = useState<IMemberData | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop()
    controlsRef.current = null
  }, [])

  const handleScanResult = useCallback(async (result: Result) => {
    const token = result.getText()
    stopScanner()
    setScanState("loading")
    setErrorMsg(null)

    try {
      const res = await fetch("/api/qr/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json() as VerifyResponse
      if (!res.ok) {
        setErrorMsg(data.error ?? "Token invalid sau expirat")
        setScanState("error")
        return
      }
      setMember(data)
      setScanState("success")
    } catch {
      setErrorMsg("Eroare de rețea. Încearcă din nou.")
      setScanState("error")
    }
  }, [stopScanner])

  const startScanner = useCallback(async () => {
    setScanState("scanning")
    setErrorMsg(null)
    setMember(null)

    if (!readerRef.current) {
      readerRef.current = new BrowserQRCodeReader()
    }

    try {
      const controls = await readerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current ?? undefined,
        (result, _error, _controls) => {
          if (result) {
            handleScanResult(result)
          }
        }
      )
      controlsRef.current = controls
    } catch {
      setErrorMsg("Nu s-a putut accesa camera. Verifică permisiunile.")
      setScanState("error")
    }
  }, [handleScanResult])

  useEffect(() => {
    startScanner()
    return () => {
      stopScanner()
    }
  }, [startScanner, stopScanner])

  function handleReset() {
    setMember(null)
    setErrorMsg(null)
    setScanState("idle")
  }

  function handleCheckIn(orderItemId: number, newRemaining: number | null) {
    if (!member) return
    setMember((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        subscriptions: prev.subscriptions.map((sub): IActiveSub =>
          sub.orderItemId === orderItemId && typeof newRemaining === "number"
            ? { ...sub, remainingEntries: newRemaining }
            : sub
        ),
      }
    })
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Scanare QR</h1>
      <p className={styles.subheading}>Scanează codul QR al membrului pentru a verifica abonamentul.</p>

      {scanState !== "success" && (
        <div className={styles.scannerWrap}>
          <video ref={videoRef} className={styles.video} muted playsInline />
          {scanState === "scanning" && (
            <div className={styles.scanOverlay}>
              <div className={styles.scanFrame} />
            </div>
          )}

          {scanState === "idle" && (
            <button className={styles.startBtn} onClick={startScanner}>
              Pornește camera
            </button>
          )}

          {scanState === "loading" && (
            <p className={styles.statusText}>Se verifică...</p>
          )}

          {scanState === "error" && (
            <>
              <p className={styles.errorText}>{errorMsg}</p>
              <button className={styles.resetBtn} onClick={startScanner}>
                Scanează din nou
              </button>
            </>
          )}
        </div>
      )}

      {scanState === "success" && member && (
        <>
          <MemberCard member={member} onCheckIn={handleCheckIn} />
          <button className={styles.resetBtn} onClick={handleReset}>
            Scanează alt cod
          </button>
        </>
      )}
    </div>
  )
}
