import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const FROM_EMAIL = "ApexFit <noreply@apexfit.ro>";

const CATEGORY_LABELS: Record<string, string> = {
  zumba: "Zumba",
  aerobic: "Aerobic",
  cycling: "Cycling",
  fitness: "Fitness",
};

function fmtDateTime(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  const sessions = await prisma.classSession.findMany({
    where: {
      status: "SCHEDULED",
      startAt: { gte: in23h, lte: in25h },
    },
    include: {
      trainer: { select: { name: true } },
      location: { select: { name: true } },
      bookings: {
        where: { status: "CONFIRMED" },
        include: {
          user: { select: { email: true, name: true } },
        },
      },
    },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  let emailsSent = 0;

  for (const session of sessions) {
    const categoryLabel = CATEGORY_LABELS[session.categorySlug] ?? session.categorySlug;
    const dateStr = fmtDateTime(session.startAt);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://apexfit.ro";

    for (const booking of session.bookings) {
      if (!booking.user.email) continue;

      await resend.emails
        .send({
          from: FROM_EMAIL,
          to: booking.user.email,
          subject: `Reminder: sesiune ${categoryLabel} mâine · ApexFit`,
          html: `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:560px;width:100%">
        <tr><td style="background:#FF5C00;padding:28px 32px">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">ApexFit</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Reminder sesiune</p>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 16px;font-size:16px;color:#111">Salut${booking.user.name ? ` ${booking.user.name}` : ""}!</p>
          <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.6">
            Ai o sesiune rezervată mâine. Ne vedem la sală!
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;margin-bottom:24px">
            <tr style="background:#fafafa">
              <td style="padding:12px 16px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.05em;font-weight:700" colspan="2">Detalii sesiune</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;color:#888;font-size:14px;border-top:1px solid #f0f0f0">Categorie</td>
              <td style="padding:10px 16px;font-weight:700;font-size:14px;color:#111;border-top:1px solid #f0f0f0">${categoryLabel}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;color:#888;font-size:14px;border-top:1px solid #f0f0f0">Data</td>
              <td style="padding:10px 16px;font-size:14px;color:#111;border-top:1px solid #f0f0f0;text-transform:capitalize">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;color:#888;font-size:14px;border-top:1px solid #f0f0f0">Durată</td>
              <td style="padding:10px 16px;font-size:14px;color:#111;border-top:1px solid #f0f0f0">${session.durationMinutes} minute</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;color:#888;font-size:14px;border-top:1px solid #f0f0f0">Antrenor</td>
              <td style="padding:10px 16px;font-size:14px;color:#111;border-top:1px solid #f0f0f0">${session.trainer.name}</td>
            </tr>
            ${session.location ? `<tr>
              <td style="padding:10px 16px;color:#888;font-size:14px;border-top:1px solid #f0f0f0">Locație</td>
              <td style="padding:10px 16px;font-size:14px;color:#111;border-top:1px solid #f0f0f0">${session.location.name}</td>
            </tr>` : ""}
          </table>
          <a href="${baseUrl}/rezervari"
             style="display:inline-block;padding:12px 28px;background:#FF5C00;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px">
            Vezi rezervările mele
          </a>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#fafafa;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#999">© ${new Date().getFullYear()} ApexFit. Poți anula rezervarea din <a href="${baseUrl}/rezervari" style="color:#FF5C00">profilul tău</a>.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        })
        .catch(() => {});

      emailsSent++;
    }
  }

  return NextResponse.json({
    ok: true,
    sessionCount: sessions.length,
    emailsSent,
  });
}
