"use client"

import { useState, useRef, useEffect } from "react"
import { subscriptions } from "@/app/_core/subscription"
import { useAddToCart } from "@/context/addToCart/AddToCartContext"
import type { IAiMessage, IAiQuizAnswers, IAiRecommendation } from "@/types/ai"
import styles from "./AiRecommendPanel.module.scss"

const MAX_MESSAGES = 20

interface IQuizStep {
  question: string
  options: string[]
  columns: 1 | 2
  key: keyof IAiQuizAnswers
  map?: Record<string, string>
  budgetMap?: Record<string, number>
}

const QUIZ_STEPS: IQuizStep[] = [
  {
    question: "Ce activitate te interesează?",
    options: ["Fitness", "Zumba", "Aerobic", "Cycling"],
    columns: 2,
    key: "activity",
    map: { "Fitness": "fitness", "Zumba": "zumba", "Aerobic": "aerobic", "Cycling": "cycling" },
  },
  {
    question: "Cât de des vrei să vii la sală?",
    options: ["1-2x pe săptămână", "3-4x pe săptămână", "Zilnic"],
    columns: 1,
    key: "frequency",
    map: { "1-2x pe săptămână": "1-2x pe săptămână", "3-4x pe săptămână": "3-4x pe săptămână", "Zilnic": "zilnic" },
  },
  {
    question: "Care este bugetul tău lunar pentru sală?",
    options: ["Sub 100 lei", "100–200 lei", "200–400 lei", "Peste 400 lei"],
    columns: 2,
    key: "budget",
    budgetMap: { "Sub 100 lei": 80, "100–200 lei": 150, "200–400 lei": 300, "Peste 400 lei": 500 },
  },
  // Steps 3 (goal) and 4 (level) are dynamic — see ACTIVITY_GOAL_CONFIG / ACTIVITY_LEVEL_CONFIG
  {
    question: "Care este obiectivul tău principal?",
    options: [],
    columns: 2,
    key: "goal",
    map: {},
  },
  {
    question: "Ce experiență ai?",
    options: [],
    columns: 1,
    key: "level",
    map: {},
  },
  {
    question: "Cum preferi stilul antrenorului tău?",
    options: ["Energic și motivațional", "Calm și empatic", "Strict și disciplinat", "Nu contează"],
    columns: 2,
    key: "trainerStyle",
    map: { "Energic și motivațional": "energic", "Calm și empatic": "calm", "Strict și disciplinat": "strict", "Nu contează": "orice" },
  },
]

const ACTIVITY_GOAL_CONFIG: Record<string, { question: string; options: string[]; map: Record<string, string> }> = {
  fitness: {
    question: "Care este obiectivul tău principal?",
    options: ["Slăbit", "Masă musculară", "Menținut formă", "Performanță"],
    map: { "Slăbit": "slabit", "Masă musculară": "masa", "Menținut formă": "forma", "Performanță": "performanta" },
  },
  zumba: {
    question: "De ce vrei să faci Zumba?",
    options: ["Slăbit dansând", "Distracție și relaxare", "Menținut formă", "Socializare"],
    map: { "Slăbit dansând": "slabit", "Distracție și relaxare": "relaxare", "Menținut formă": "forma", "Socializare": "relaxare" },
  },
  cycling: {
    question: "Care este obiectivul tău la Cycling?",
    options: ["Slăbit rapid", "Rezistență cardio", "Antrenament intensiv", "Menținut formă"],
    map: { "Slăbit rapid": "slabit", "Rezistență cardio": "cardio", "Antrenament intensiv": "performanta", "Menținut formă": "forma" },
  },
  aerobic: {
    question: "Ce vrei să obții prin Aerobic?",
    options: ["Slăbit", "Tonifiere", "Menținut formă", "Relaxare"],
    map: { "Slăbit": "slabit", "Tonifiere": "tonifiere", "Menținut formă": "forma", "Relaxare": "relaxare" },
  },
}

const ACTIVITY_LEVEL_CONFIG: Record<string, { question: string; options: string[]; map: Record<string, string>; columns: 1 | 2 }> = {
  fitness: {
    question: "Ce nivel de experiență ai în sala de fitness?",
    options: ["Începător", "Intermediar", "Avansat"],
    map: { "Începător": "incepator", "Intermediar": "intermediar", "Avansat": "avansat" },
    columns: 1,
  },
  zumba: {
    question: "Ai mai dansat sau făcut Zumba?",
    options: ["Prima oară", "Am mai dansat puțin", "Am experiență în dans"],
    map: { "Prima oară": "incepator", "Am mai dansat puțin": "intermediar", "Am experiență în dans": "avansat" },
    columns: 1,
  },
  cycling: {
    question: "Ai mai făcut Cycling sau sport cardio?",
    options: ["Prima oară pe bicicletă fixă", "Am mai făcut sport cardio", "Sportiv activ"],
    map: { "Prima oară pe bicicletă fixă": "incepator", "Am mai făcut sport cardio": "intermediar", "Sportiv activ": "avansat" },
    columns: 1,
  },
  aerobic: {
    question: "Ai mai făcut clase de grup sau aerobic?",
    options: ["Prima oară", "Am mai participat", "Fac regulat"],
    map: { "Prima oară": "incepator", "Am mai participat": "intermediar", "Fac regulat": "avansat" },
    columns: 1,
  },
}

function getStepConfig(stepIndex: number, activity: string): IQuizStep {
  if (stepIndex === 3) {
    const cfg = ACTIVITY_GOAL_CONFIG[activity] ?? ACTIVITY_GOAL_CONFIG.fitness
    return { ...QUIZ_STEPS[3], question: cfg.question, options: cfg.options, map: cfg.map }
  }
  if (stepIndex === 4) {
    const cfg = ACTIVITY_LEVEL_CONFIG[activity] ?? ACTIVITY_LEVEL_CONFIG.fitness
    return { ...QUIZ_STEPS[4], question: cfg.question, options: cfg.options, map: cfg.map, columns: cfg.columns }
  }
  return QUIZ_STEPS[stepIndex]
}

const CATEGORY_LABELS: Record<string, string> = {
  fitness: "Fitness",
  zumba: "Zumba",
  cycling: "Cycling",
  aerobic: "Aerobic",
}

interface IAiRecommendPanelProps {
  onClose: () => void
}

export default function AiRecommendPanel({ onClose }: IAiRecommendPanelProps) {
  const { addToCartHandler } = useAddToCart()
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Partial<IAiQuizAnswers>>({})
  const [messages, setMessages] = useState<IAiMessage[]>([
    { role: "assistant", content: QUIZ_STEPS[0].question },
  ])
  const [phase, setPhase] = useState<"quiz" | "loading" | "chat">("quiz")
  const [recommendation, setRecommendation] = useState<IAiRecommendation | null>(null)
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, phase])

  async function handleQuizOption(option: string) {
    const step = getStepConfig(quizStep, quizAnswers.activity ?? "fitness")
    const newAnswers = { ...quizAnswers }

    if (step.key === "budget") {
      newAnswers.budget = step.budgetMap![option]
    } else {
      const value = step.map![option]
      if (step.key === "activity") newAnswers.activity = value
      else if (step.key === "frequency") newAnswers.frequency = value
      else if (step.key === "goal") newAnswers.goal = value
      else if (step.key === "level") newAnswers.level = value
      else if (step.key === "trainerStyle") newAnswers.trainerStyle = value
    }
    setQuizAnswers(newAnswers)

    const activityForNext = step.key === "activity" ? (step.map![option] ?? "fitness") : (newAnswers.activity ?? "fitness")
    const userMsg: IAiMessage = { role: "user", content: option }
    if (quizStep < QUIZ_STEPS.length - 1) {
      const nextStep = getStepConfig(quizStep + 1, activityForNext)
      setMessages((prev) => [...prev, userMsg, { role: "assistant", content: nextStep.question }])
      setQuizStep((s) => s + 1)
    } else {
      setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "Analizez răspunsurile tale..." }])
      setPhase("loading")
      await fetchRecommendation(newAnswers as IAiQuizAnswers)
    }
  }

  async function fetchRecommendation(answers: IAiQuizAnswers) {
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json() as IAiRecommendation
      setRecommendation(data)
      setMessages((prev) => [...prev, { role: "assistant", content: data.reason }])
      setPhase("chat")
      setTimeout(() => inputRef.current?.focus(), 150)
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Nu am putut genera o recomandare. Încearcă din nou." }])
      setPhase("chat")
    }
  }

  async function sendMessageHandler() {
    if (!input.trim() || streaming || messages.length >= MAX_MESSAGES) return
    const userMsg: IAiMessage = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setStreaming(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, quizAnswers }),
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

  function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessageHandler()
    }
  }

  function addToCartClickHandler() {
    if (!recommendation) return
    const sub = subscriptions.find((s) => s.id === recommendation.subscriptionId)
    if (sub) addToCartHandler(sub)
  }

  function resetHandler() {
    setQuizStep(0)
    setQuizAnswers({})
    setMessages([{ role: "assistant", content: QUIZ_STEPS[0].question }])
    setPhase("quiz")
    setRecommendation(null)
    setInput("")
    setStreaming(false)
  }

  const atLimit = messages.length >= MAX_MESSAGES
  const recommendedSub = recommendation ? subscriptions.find((s) => s.id === recommendation.subscriptionId) : null
  const progressPct = phase === "quiz" ? ((quizStep) / QUIZ_STEPS.length) * 100 : 100
  const currentStep = getStepConfig(quizStep, quizAnswers.activity ?? "fitness")

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerIdentity}>
            <div className={styles.headerAvatar}>AF</div>
            <div className={styles.headerInfo}>
              <span className={styles.headerName}>Asistent ApexFit</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} />
                Disponibil acum
              </span>
            </div>
          </div>
          <div className={styles.headerBtns}>
            <button className={styles.closeBtn} onClick={resetHandler} aria-label="Reîncepe quiz-ul" title="Reîncepe">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
              </svg>
            </button>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Închide">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.progressBar}>
          <span className={styles.progressLabel}>
            {phase === "quiz"
              ? `Întrebarea ${quizStep + 1} din ${QUIZ_STEPS.length}`
              : "Recomandare gata"}
          </span>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
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

        {/* Quiz quick replies */}
        {phase === "quiz" && quizStep < QUIZ_STEPS.length && (
          <div className={currentStep.columns === 1 ? styles.quickRepliesSingle : styles.quickReplies}>
            {currentStep.options.map((opt) => (
              <button key={opt} className={styles.quickReply} onClick={() => handleQuizOption(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {phase === "loading" && (
          <div className={styles.typingRow}>
            <div className={styles.msgAvatar}>AF</div>
            <div className={styles.typing}>
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* Subscription recommendation card */}
        {phase === "chat" && recommendedSub && (
          <div className={styles.recommendWrap}>
            <div className={styles.recommendCard}>
              <div className={styles.recommendCardAccent} />
              <div className={styles.recommendCardBody}>
                <span className={styles.recommendBadge}>✦ Recomandat pentru tine</span>
                <p className={styles.recommendName}>
                  {CATEGORY_LABELS[recommendedSub.category] ?? recommendedSub.category}
                  {" — "}
                  {recommendedSub.planType === "entries"
                    ? `${recommendedSub.pass} intrări`
                    : `${recommendedSub.durationMonths} lun${recommendedSub.durationMonths === 1 ? "ă" : "i"}`}
                </p>
                <p className={styles.recommendMeta}>
                  {recommendedSub.planType === "entries" ? "Abonament pe intrări" : "Abonament lunar"}
                </p>
                <p className={styles.recommendPrice}>
                  {recommendedSub.price} RON{" "}
                  <span>/ {recommendedSub.planType === "entries" ? `${recommendedSub.pass} intrări` : "lună"}</span>
                </p>
                <button className={styles.addToCartBtn} onClick={addToCartClickHandler}>
                  Adaugă în coș
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trainer recommendation card */}
        {phase === "chat" && recommendation?.trainer && (
          <div className={styles.trainerWrap}>
            <div className={styles.trainerCard}>
              <div className={styles.trainerCardAccent} />
              <div className={styles.trainerCardBody}>
                <span className={styles.trainerBadge}>★ Antrenor recomandat</span>
                <p className={styles.trainerName}>{recommendation.trainer.name}</p>
                {recommendation.trainerReason && (
                  <p className={styles.trainerDesc}>{recommendation.trainerReason}</p>
                )}
                {recommendation.trainer.teachingStyle && (
                  <p className={styles.trainerStyle}>{recommendation.trainer.teachingStyle}</p>
                )}
                {recommendation.trainer.locationSlug && (
                  <a
                    href={`/antrenori/${recommendation.trainer.locationSlug}`}
                    className={styles.trainerLink}
                  >
                    Vezi profil
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {atLimit && (
          <p className={styles.limitNotice}>Sesiunea a atins limita. Reîncarcă pagina pentru a continua.</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {phase === "chat" && (
        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder={atLimit ? "Limită atinsă" : "Întreabă ceva despre abonamente..."}
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
