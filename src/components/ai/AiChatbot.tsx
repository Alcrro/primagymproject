"use client"

import { useState, useRef, useEffect } from "react"
import type { IAiMessage } from "@/types/ai"
import styles from "./AiChatbot.module.scss"

const MAX_MESSAGES = 20
const WELCOME: IAiMessage = {
  role: "assistant",
  content: "Bună! Sunt asistentul ApexFit 👋\nTe pot ajuta cu informații despre abonamente, program, activități sau orice altceva despre sală.",
}
const SUGGESTIONS = [
  "Care e programul sălii?",
  "Ce abonamente aveți disponibile?",
  "Ce activități de grup există?",
  "Cum ajung la sală?",
]

export default function AiChatbot() {
  const [open, setOpen] = useState(false)
  const [labelVisible, setLabelVisible] = useState(true)
  const [messages, setMessages] = useState<IAiMessage[]>([WELCOME])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      setTimeout(() => inputRef.current?.focus(), 250)
      setLabelVisible(false)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || streaming || messages.length >= MAX_MESSAGES) return
    setShowSuggestions(false)
    const userMsg: IAiMessage = { role: "user", content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setStreaming(true)

    try {
      const res = await fetch("/api/ai/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
        })
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Eroare. Încearcă din nou." }])
    } finally {
      setStreaming(false)
    }
  }

  function sendMessageHandler() { sendMessage(input) }

  function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessageHandler()
    }
  }

  function toggleHandler() {
    setOpen((o) => !o)
    setLabelVisible(false)
  }

  const atLimit = messages.length >= MAX_MESSAGES

  return (
    <div className={styles.wrap}>
      {open && (
        <div className={styles.window}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerAvatar}>AF</div>
              <div className={styles.headerInfo}>
                <span className={styles.headerName}>Asistent ApexFit</span>
                <span className={styles.headerStatus}>
                  <span className={styles.statusDot} />
                  {streaming ? "Scrie..." : "Disponibil acum"}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.headerBtn}
                onClick={() => {
                  setMessages([WELCOME])
                  setShowSuggestions(true)
                  setInput("")
                }}
                aria-label="Conversație nouă"
                title="Conversație nouă"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                </svg>
              </button>
              <button
                className={styles.headerBtn}
                onClick={() => setOpen(false)}
                aria-label="Minimizează"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button
                className={styles.headerBtn}
                onClick={() => {
                  setOpen(false)
                  setMessages([WELCOME])
                  setShowSuggestions(true)
                }}
                aria-label="Închide"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.msgRow} ${msg.role === "user" ? styles.msgRowUser : styles.msgRowAi}`}>
                {msg.role === "assistant" && <div className={styles.msgAvatar}>AF</div>}
                <div className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleAi}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggested questions — visible only before first user message */}
            {showSuggestions && (
              <div className={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} className={styles.suggestion} onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Typing */}
            {streaming && (
              <div className={styles.typingRow}>
                <div className={styles.msgAvatar}>AF</div>
                <div className={styles.typing}>
                  <span /><span /><span />
                </div>
              </div>
            )}

            {atLimit && (
              <p className={styles.limitNotice}>
                Sesiunea a atins limita. Apasă ✕ pentru a reseta conversația.
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                className={styles.input}
                placeholder={atLimit ? "Limită atinsă — resetează conversația" : "Scrie un mesaj..."}
                value={input}
                disabled={atLimit || streaming}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={keyDownHandler}
              />
              <button
                className={styles.sendBtn}
                onClick={sendMessageHandler}
                disabled={atLimit || streaming || !input.trim()}
                aria-label="Trimite"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <div className={styles.fabWrap}>
        {!open && labelVisible && (
          <span className={styles.fabLabel}>Ai o întrebare?</span>
        )}
        {!open && <div className={styles.fabRing} />}
        <button className={styles.fab} onClick={toggleHandler} aria-label={open ? "Închide chat" : "Deschide chat"}>
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
