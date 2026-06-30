import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/ratelimit"
import { prisma } from "@/lib/prisma"
import { getToneInstruction } from "@/lib/aiTone"
import type { IAiMessage } from "@/types/ai"

const MAX_HISTORY = 14

const SYSTEM_PROMPT = `Ești asistentul de onboarding al sălii de fitness ApexFit din Bacău. Sarcina ta este să colectezi o fișă de client prin conversație naturală și prietenoasă.

Colectează OBLIGATORIU (în ordine naturală, câte o întrebare pe mesaj):
1. Motivul principal pentru care vine la sală (fitness general, recuperare după accidentare, slăbit, masă musculară, etc.)
2. Dacă a menționat recuperare, accidentare sau probleme fizice → întreabă ce s-a întâmplat și ce restricții are. Dacă nu → pune injuries="" și medicalRestrictions="".
3. Obiectivul principal fitness (dacă nu a reieșit deja din răspunsul la motivul vizitei)
4. Nivelul de experiență cu exercițiile fizice (începător / intermediar / avansat)
5. Câte zile pe săptămână poate veni și în ce interval orar (dimineață / prânz / seară)

Reguli stricte:
- Pune o singură întrebare per mesaj
- Fii empatic, cald, prietenos — ca un recepționer de sală, nu ca un formular medical
- Răspunde EXCLUSIV în română
- Nu cere detalii medicale specifice (diagnostice, medicamente) — rămâi la nivel fizic/activitate
- Nu repeta întrebări la care s-a răspuns deja

Când ai colectat TOATE cele 5 categorii de informații, trimite un mesaj natural de finalizare (ex: "Am tot ce îmi trebuie! Antrenorul tău va putea consulta fișa ta înainte de prima ședință. Ne vedem la sală! 💪") urmat IMEDIAT, pe o linie nouă, de:
[PROFILE_COMPLETE]{"reason":"...","injuries":"...","medicalRestrictions":"...","fitnessGoal":"...","experienceLevel":"...","daysPerWeek":N,"preferredHours":"...","aiSummary":"Rezumat de 2-3 propoziții pentru antrenor, în română, cu informațiile relevante colectate."}

Dacă lipsesc date (ex: nu are accidentări), pune string gol "" sau 0 pentru numeric. JSON-ul trebuie să fie valid.`

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(`intake:${ip}`, 60)) {
    return new Response("Prea multe cereri. Încearcă din nou în câteva minute.", { status: 429 })
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

  if (!process.env.OPENAI_API_KEY) {
    const fallback = messages.length === 0
      ? "Bun venit la ApexFit! Din păcate asistentul AI nu este disponibil acum. Te rugăm să completezi fișa la recepție."
      : "Mulțumim! Un antrenor te va contacta în curând."
    return new Response(fallback, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
  }

  const trimmed = messages.slice(-MAX_HISTORY)
  const systemContent = `${SYSTEM_PROMPT}\n\n${getToneInstruction(communicationStyle)}`
  const openAiMessages = [
    { role: "system", content: systemContent },
    ...trimmed.map((m) => ({ role: m.role, content: m.content })),
  ]

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: openAiMessages,
        stream: true,
        temperature: 0.6,
      }),
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
    return new Response("Eroare. Încearcă din nou.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
