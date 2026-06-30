import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/ratelimit"
import { subscriptions } from "@/app/_core/subscription"
import { prisma } from "@/lib/prisma"
import { getToneInstruction } from "@/lib/aiTone"
import type { IAiMessage, IAiQuizAnswers } from "@/types/ai"
import type { ICart } from "@/types/subscription"

const MAX_HISTORY = 10

function formatSubscriptions(list: ICart[]): string {
  return list
    .map((s) => {
      if (s.planType === "entries") return `ID ${s.id}: ${s.category} — ${s.pass} intrări — ${s.price} RON`
      return `ID ${s.id}: ${s.category} — ${s.durationMonths} luni — ${s.price} RON`
    })
    .join("\n")
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(`chat:${ip}`, 50)) {
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

  const body = await req.json() as { messages: IAiMessage[]; quizAnswers: IAiQuizAnswers }
  const { messages, quizAnswers } = body

  if (!process.env.OPENAI_API_KEY) {
    return new Response("Asistentul AI nu este disponibil momentan. Contactează-ne la contact@apexfit.ro.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const systemPrompt = `Ești un consultant fitness prietenos pentru sala ApexFit din Bacău.
Clientul a completat un quiz și a primit o recomandare. Răspunde întrebărilor lui despre abonamente, activități și programul sălii. Fii concis și util. Răspunde doar în română.

Context client:
- Buget: ${quizAnswers.budget} RON/lună
- Frecvență: ${quizAnswers.frequency}
- Activitate preferată: ${quizAnswers.activity}
- Obiectiv: ${quizAnswers.goal}
- Nivel: ${quizAnswers.level}

Abonamente disponibile:
${formatSubscriptions(subscriptions)}

Program sală: Luni–Vineri 08:00–22:00, Sâmbătă 08:00–13:00, Duminică închis.
Nu promite reduceri sau condiții care nu sunt în lista de mai sus.

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
      body: JSON.stringify({ model: "gpt-4o", messages: openAiMessages, stream: true, temperature: 0.7 }),
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
              } catch { /* skip malformed chunks */ }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
  } catch {
    return new Response("Asistentul nu e disponibil momentan. Încearcă din nou.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
