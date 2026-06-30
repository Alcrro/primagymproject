"use client"

import { useState, useRef, useEffect } from "react"
import type { IAiMessage, IClientProfileData } from "@/types/ai"
import styles from "./AiIntakeModal.module.scss"

const PROFILE_MARKER = "[PROFILE_COMPLETE]"

const WELCOME: IAiMessage = {
  role: "assistant",
  content:
    "Bun venit la ApexFit! 👋 Mă bucur că ești aici.\nCa să te putem ajuta cât mai bine, hai să vorbim un pic despre tine. De ce ai decis să vii la sală? Ce te-a adus la noi?",
}

interface IAiIntakeModalProps {
  onClose: () => void
}

export default function AiIntakeModal({ onClose }: IAiIntakeModalProps) {
  const [messages, setMessages] = useState<IAiMessage[]>([WELCOME])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!streaming && !done) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [streaming, done])

  async function sendMessage(text: string) {
    if (!text.trim() || streaming || done) return

    const userMsg: IAiMessage = { role: "user", content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setStreaming(true)

    try {
      const res = await fetch("/api/ai/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break
        const chunk = decoder.decode(value)
        fullText += chunk

        const markerIdx = fullText.indexOf(PROFILE_MARKER)
        const display = markerIdx !== -1 ? fullText.slice(0, markerIdx).trim() : fullText

        setMessages((prev) => {
          const last = prev[prev.length - 1]
          return [...prev.slice(0, -1), { ...last, content: display }]
        })
      }

      const markerIdx = fullText.indexOf(PROFILE_MARKER)
      if (markerIdx !== -1) {
        const jsonStr = fullText.slice(markerIdx + PROFILE_MARKER.length).trim()
        try {
          const profileData = JSON.parse(jsonStr) as IClientProfileData
          await saveProfile(profileData, [...newMessages, { role: "assistant", content: fullText.slice(0, markerIdx).trim() }])
        } catch {
          // save failed silently — don't block the user
        }
        setDone(true)
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Eroare. Încearcă din nou." }])
    } finally {
      setStreaming(false)
    }
  }

  async function saveProfile(profile: IClientProfileData, conversation: IAiMessage[]) {
    setSaving(true)
    try {
      await fetch("/api/ai/intake/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, conversation }),
      })
    } finally {
      setSaving(false)
    }
  }

  function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className={styles.overlay} onClick={done ? onClose : undefined}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>AF</div>
            <div className={styles.headerInfo}>
              <span className={styles.headerName}>Asistent ApexFit</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} />
                {streaming ? "Scrie..." : done ? "Fișă completată" : "Online"}
              </span>
            </div>
          </div>
          {done && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Închide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.msgRow} ${msg.role === "user" ? styles.msgRowUser : styles.msgRowAi}`}
            >
              {msg.role === "assistant" && <div className={styles.msgAvatar}>AF</div>}
              <div className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleAi}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {streaming && (
            <div className={styles.typingRow}>
              <div className={styles.msgAvatar}>AF</div>
              <div className={styles.typing}>
                <span /><span /><span />
              </div>
            </div>
          )}

          {done && (
            <div className={styles.doneCard}>
              <div className={styles.doneIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className={styles.doneText}>
                <span className={styles.doneTitle}>Fișa ta a fost salvată</span>
                <span className={styles.doneSub}>
                  {saving ? "Se salvează..." : "Antrenorul tău o va putea consulta înainte de prima ședință."}
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!done && (
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                className={styles.input}
                placeholder="Scrie răspunsul tău..."
                value={input}
                disabled={streaming}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={keyDownHandler}
              />
              <button
                className={styles.sendBtn}
                onClick={() => sendMessage(input)}
                disabled={streaming || !input.trim()}
                aria-label="Trimite"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className={styles.hint}>Informațiile sunt confidențiale și vizibile doar antrenorului tău</p>
          </div>
        )}

        {done && (
          <div className={styles.doneFooter}>
            <button className={styles.doneCloseBtn} onClick={onClose}>
              Intră în cont
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
