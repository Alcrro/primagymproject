import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/ratelimit"
import { subscriptions } from "@/app/_core/subscription"
import { program } from "@/app/_core/program"
import { contact } from "@/app/_core/contact"
import { prisma } from "@/lib/prisma"
import { getToneInstruction } from "@/lib/aiTone"
import type { IAiMessage } from "@/types/ai"
import type { ICart } from "@/types/subscription"
import type { Trainer } from "@prisma/client"

const MAX_HISTORY = 10

function formatSubscriptions(list: ICart[]): string {
  return list
    .map((s) => {
      if (s.planType === "entries") return `${s.category} — ${s.pass} intrări — ${s.price} RON`
      return `${s.category} — ${s.durationMonths} luni — ${s.price} RON`
    })
    .join("\n")
}

function formatTrainers(list: Trainer[]): string {
  if (!list.length) return "Niciun antrenor disponibil momentan."
  return list.map((t) => {
    const parts: string[] = [`## ${t.name} (${t.category})`]
    if (t.classes.length)           parts.push(`Clase predate: ${t.classes.join(", ")}`)
    if (t.specializations.length)   parts.push(`Specializări: ${t.specializations.join(", ")}`)
    if (t.certifications.length)    parts.push(`Certificări: ${t.certifications.join(", ")}`)
    if (t.description)              parts.push(`Descriere: ${t.description}`)
    if (t.bio)                      parts.push(`Bio: ${t.bio}`)
    if (t.teachingStyle)            parts.push(`Stil de predare / caracter: ${t.teachingStyle}`)
    if (t.avoidedApproaches)        parts.push(`Ce evită / nu face: ${t.avoidedApproaches}`)
    return parts.join("\n")
  }).join("\n\n")
}

let cachedTrainers: Trainer[] | null = null
let cacheAt = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minute

async function getTrainers(): Promise<Trainer[]> {
  const now = Date.now()
  if (cachedTrainers && now - cacheAt < CACHE_TTL) return cachedTrainers
  cachedTrainers = await prisma.trainer.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })
  cacheAt = now
  return cachedTrainers
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(`chatbot:${ip}`, 50)) {
    return new Response("Prea multe cereri. Încearcă din nou peste câteva minute.", { status: 429 })
  }

  const session = await auth()
  let communicationStyle: string | null = null
  if (session?.user?.id) {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
      select: { communicationStyle: true },
    })
    communicationStyle = profile?.communicationStyle ?? null
  }

  const body = await req.json() as { messages: IAiMessage[] }
  const { messages } = body

  const contactInfo = contact.map((c) => `${c.label}: ${c.value}`).join(", ")
  const programInfo = program.map((p) => `${p.day}: ${p.hours}`).join(", ")

  if (!process.env.OPENAI_API_KEY) {
    const phone = contact.find((c) => c.label === "Telefon")?.value ?? "contact@apexfit.ro"
    return new Response(`Asistentul nu este disponibil momentan. Ne poți contacta la ${phone}.`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const trainers = await getTrainers()

  const systemPrompt = `Ești asistentul virtual al sălii de fitness ApexFit din Bacău. Răspunzi întrebărilor vizitatorilor despre sală, abonamente, program, activități și antrenori. Fii prietenos, concis și răspunde doar în română.

Program: ${programInfo}
Contact: ${contactInfo}

Abonamente disponibile:
${formatSubscriptions(subscriptions)}

Activități: Fitness, Zumba, Cycling, Aerobic.

Antrenori:
${formatTrainers(trainers)}

Reguli:
- Răspunde doar pe baza informațiilor de mai sus. Nu inventa date.
- Dacă ești întrebat despre caracterul sau stilul unui antrenor, folosește câmpurile "Stil de predare" și "Ce evită".
- Nu poți procesa plăți sau modifica conturi. Pentru probleme de cont, redirecționează la contact.

${getToneInstruction(communicationStyle)}`

  const trimmedHistory = messages.slice(-MAX_HISTORY)
  const openAiMessages = [
    { role: "system", content: systemPrompt },
    ...trimmedHistory.map((m) => ({ role: m.role, content: m.content })),
  ]

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o", messages: openAiMessages, stream: true, temperature: 0.5 }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader()
        const decoder = new TextDecoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            for (const line of chunk.split("\n")) {
              const trimmed = line.replace(/^data: /, "").trim()
              if (!trimmed || trimmed === "[DONE]") continue
              try {
                const json = JSON.parse(trimmed) as { choices: { delta: { content?: string } }[] }
                const text = json.choices[0]?.delta?.content ?? ""
                if (text) controller.enqueue(encoder.encode(text))
              } catch { /* skip malformed */ }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
  } catch {
    const phone = contact.find((c) => c.label === "Telefon")?.value ?? "contact@apexfit.ro"
    return new Response(`Asistentul nu e disponibil momentan. Contactează-ne la ${phone}.`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
