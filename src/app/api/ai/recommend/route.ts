import { NextRequest, NextResponse } from "next/server"
import { subscriptions } from "@/app/_core/subscription"
import { checkRateLimit } from "@/lib/ratelimit"
import { prisma } from "@/lib/prisma"
import type { IAiQuizAnswers, IAiRecommendation, IAiTrainerRecommendation } from "@/types/ai"
import type { ICart } from "@/types/subscription"
import type { Trainer, Location } from "@prisma/client"

type TrainerWithLocation = Trainer & { location: Pick<Location, "slug"> | null }

function formatSubscriptions(list: ICart[]): string {
  return list
    .map((s) => {
      if (s.planType === "entries") return `ID ${s.id}: ${s.category} — ${s.pass} intrări — ${s.price} RON`
      return `ID ${s.id}: ${s.category} — ${s.durationMonths} luni — ${s.price} RON`
    })
    .join("\n")
}

function formatTrainersForPrompt(list: TrainerWithLocation[]): string {
  if (!list.length) return "Niciun antrenor disponibil."
  return list.map((t) => {
    const parts = [`ID ${t.id}: ${t.name} (categorie: ${t.category})`]
    if (t.teachingStyle) parts.push(`Stil: ${t.teachingStyle}`)
    if (t.avoidedApproaches) parts.push(`Evită: ${t.avoidedApproaches}`)
    if (t.description) parts.push(`Descriere: ${t.description}`)
    return parts.join(" | ")
  }).join("\n")
}

function toTrainerRec(t: TrainerWithLocation): IAiTrainerRecommendation {
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    teachingStyle: t.teachingStyle,
    thumbnail: t.thumbnail,
    locationSlug: t.location?.slug ?? null,
  }
}

function fallbackRecommend(answers: IAiQuizAnswers, trainers: TrainerWithLocation[]): IAiRecommendation {
  const activity = answers.activity === "mixt" ? "fitness" : answers.activity
  const useMonthly = answers.budget >= 150
  const filtered = subscriptions.filter(
    (s) => s.category === activity && s.planType === (useMonthly ? "monthly" : "entries")
  )
  const pool = filtered.length > 0 ? filtered : subscriptions.filter((s) => s.category === "fitness")
  const affordable = pool.filter((s) => s.price <= answers.budget)
  const pick = affordable.length > 0
    ? affordable.reduce((a, b) => (b.price > a.price ? b : a))
    : pool[0]
  const label = pick.planType === "monthly"
    ? `${pick.durationMonths} lun${pick.durationMonths === 1 ? "ă" : "i"}`
    : `${pick.pass} intrări`

  const activeTrainers = trainers.filter((t) => t.isActive)
  const categoryPool = activeTrainers.filter((t) => t.category === activity)
  const trainerPool = categoryPool.length > 0 ? categoryPool : activeTrainers
  let trainer: IAiTrainerRecommendation | undefined
  if (trainerPool.length > 0) {
    const style = answers.trainerStyle
    const matched = style && style !== "orice"
      ? trainerPool.find((t) => t.teachingStyle?.toLowerCase().includes(style.toLowerCase()))
      : null
    trainer = toTrainerRec(matched ?? trainerPool[0])
  }

  return {
    subscriptionId: pick.id,
    reason: `Abonament ${pick.category} — ${label} — ${pick.price} RON. Potrivit pentru bugetul și frecvența ta.`,
    trainer,
    trainerReason: trainer
      ? `${trainer.name} se potrivește stilului pe care l-ai ales.`
      : undefined,
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(`recommend:${ip}`, 30)) {
    return NextResponse.json({ error: "Prea multe cereri. Încearcă din nou peste câteva minute." }, { status: 429 })
  }

  const body = await req.json() as { answers: IAiQuizAnswers }
  const { answers } = body

  const trainers = await prisma.trainer.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { location: { select: { slug: true } } },
  })

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(fallbackRecommend(answers, trainers))
  }

  const prompt = `Ești un consultant fitness pentru sala ApexFit.
Clientul a completat un quiz:
- Activitate preferată: ${answers.activity}
- Frecvență: ${answers.frequency}
- Buget lunar: ${answers.budget} RON
- Obiectiv: ${answers.goal}
- Nivel experiență: ${answers.level}
- Stil antrenor preferat: ${answers.trainerStyle}

Abonamente disponibile:
${formatSubscriptions(subscriptions)}

Antrenori disponibili:
${formatTrainersForPrompt(trainers)}

Recomandă cel mai potrivit abonament ȘI cel mai potrivit antrenor pentru stilul preferat de client.
Răspunde EXCLUSIV cu un JSON valid, fără text suplimentar:
{"subscriptionId": <număr>, "reason": "<justificare abonament, 1-2 propoziții în română>", "trainerId": <număr sau null>, "trainerReason": "<de ce acest antrenor, 1 propoziție în română sau null>"}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: prompt }], temperature: 0.3 }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const data = await res.json() as { choices: { message: { content: string } }[] }
    const raw = data.choices[0]?.message?.content?.trim() ?? ""
    const parsed = JSON.parse(raw) as {
      subscriptionId: number
      reason: string
      trainerId: number | null
      trainerReason: string | null
    }

    const validSub = subscriptions.find((s) => s.id === parsed.subscriptionId)
    if (!validSub) return NextResponse.json(fallbackRecommend(answers, trainers))

    const matchedTrainer = parsed.trainerId
      ? trainers.find((t) => t.id === parsed.trainerId)
      : null

    return NextResponse.json({
      subscriptionId: parsed.subscriptionId,
      reason: parsed.reason,
      trainer: matchedTrainer ? toTrainerRec(matchedTrainer) : undefined,
      trainerReason: parsed.trainerReason ?? undefined,
    } satisfies IAiRecommendation)
  } catch {
    return NextResponse.json(fallbackRecommend(answers, trainers))
  }
}
