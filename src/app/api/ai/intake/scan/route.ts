import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/ratelimit"

export interface IScanResult {
  injuries: string
  medicalRestrictions: string
  notes: string
}

const SUPPORTED_IMAGES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"]
const MAX_SIZE_MB = 10

const PROMPT = `Ești un asistent medical pentru o sală de fitness. Analizează acest document medical și extrage informațiile relevante pentru un antrenor de fitness.

Returnează EXCLUSIV un JSON valid cu exact aceste câmpuri:
{
  "injuries": "Descriere scurtă a accidentărilor, operațiilor sau problemelor fizice menționate. Dacă nu există, returnează string gol.",
  "medicalRestrictions": "Restricții fizice, mișcări interzise sau contraindicații pentru exerciții. Dacă nu există, returnează string gol.",
  "notes": "Alte informații relevante pentru antrenor (diagnostic general, recomandări medicale pentru activitate fizică). Dacă nu există, returnează string gol."
}

Fii concis și specific. Nu inventa informații care nu sunt în document. Răspunde în română.`

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(`scan:${ip}`, 10)) {
    return NextResponse.json({ error: "Prea multe cereri. Încearcă din nou în câteva minute." }, { status: 429 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "AI indisponibil. Completează manual câmpurile." }, { status: 503 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "Niciun fișier trimis." }, { status: 400 })
  }

  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > MAX_SIZE_MB) {
    return NextResponse.json({ error: `Fișierul este prea mare (max ${MAX_SIZE_MB}MB).` }, { status: 400 })
  }

  const mimeType = file.type.toLowerCase()
  const isImage = SUPPORTED_IMAGES.some((t) => mimeType.includes(t.split("/")[1]))
  const isPDF = mimeType === "application/pdf"

  if (!isImage && !isPDF) {
    return NextResponse.json({ error: "Format nesuportat. Acceptăm JPG, PNG, WEBP sau PDF." }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString("base64")

  try {
    let content: object[]

    if (isImage) {
      content = [
        { type: "text", text: PROMPT },
        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}`, detail: "high" } },
      ]
    } else {
      // PDF — trimis ca text prin file content extraction
      content = [
        {
          type: "text",
          text: `${PROMPT}\n\nDocumentul următor este un PDF codificat în base64:\n${base64.slice(0, 8000)}`,
        },
      ]
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content }],
        temperature: 0.2,
        max_tokens: 500,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const data = await res.json() as { choices: { message: { content: string } }[] }
    const raw = data.choices[0]?.message?.content?.trim() ?? ""

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Nu am putut extrage informații din document." }, { status: 422 })
    }

    const parsed = JSON.parse(jsonMatch[0]) as IScanResult
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: "Eroare la analiza documentului. Încearcă din nou." }, { status: 500 })
  }
}
