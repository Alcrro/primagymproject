import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import Stripe from 'stripe';

const FROM_EMAIL = 'ApexFit <noreply@apexfit.ro>';

function fmtDate(date: Date): string {
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildConfirmationEmail(
  name: string | null,
  items: { planName: string; categoryName: string; quantity: number; priceRon: unknown; expiresAt: Date | null }[],
  totalRon: unknown,
): string {
  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${item.planName}${item.quantity > 1 ? ` ×${item.quantity}` : ''}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${Number(item.priceRon) * item.quantity} Lei</td>
        </tr>${
          item.expiresAt
            ? `<tr><td colspan="2" style="padding:2px 12px 10px;font-size:12px;color:#888;border-bottom:1px solid #f0f0f0">Valabil până la ${fmtDate(item.expiresAt)}</td></tr>`
            : ''
        }`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:560px;width:100%">
        <tr><td style="background:#FF5C00;padding:28px 32px">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">ApexFit</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Confirmare comandă</p>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 20px;font-size:16px;color:#111">Bună${name ? ` ${name}` : ''}!</p>
          <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.6">
            Plata ta a fost procesată cu succes. Abonamentul tău ApexFit este acum activ.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;margin-bottom:20px">
            <thead>
              <tr style="background:#fafafa">
                <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.05em">Plan</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.05em">Preț</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr style="background:#fafafa">
                <td style="padding:10px 12px;font-weight:700;color:#111">Total</td>
                <td style="padding:10px 12px;text-align:right;font-weight:700;color:#FF5C00">${Number(totalRon)} Lei</td>
              </tr>
            </tfoot>
          </table>
          <p style="margin:0 0 8px;font-size:14px;color:#555;line-height:1.6">
            Accesează profilul tău pentru a vedea abonamentele active și codul QR de check-in.
          </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://apexfit.ro'}/profil"
             style="display:inline-block;margin-top:16px;padding:12px 28px;background:#FF5C00;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px">
            Vezi profilul meu
          </a>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#fafafa;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#999">© ${new Date().getFullYear()} ApexFit. Toate drepturile rezervate.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const stripeSession = event.data.object as Stripe.Checkout.Session;
    const paymentTime = new Date();

    await prisma.order.updateMany({
      where: { paymentRef: stripeSession.id },
      data: { status: 'PAID' },
    });

    const order = await prisma.order.findFirst({
      where: { paymentRef: stripeSession.id },
      include: {
        user: { select: { email: true, name: true } },
        items: true,
      },
    });

    if (order) {
      // Recalculate expiresAt from payment time (preserves original duration)
      for (const item of order.items) {
        if (item.expiresAt && order.createdAt) {
          const originalDuration = item.expiresAt.getTime() - order.createdAt.getTime();
          await prisma.orderItem.update({
            where: { id: item.id },
            data: { expiresAt: new Date(paymentTime.getTime() + originalDuration) },
          });
        }
      }

      // Re-fetch items with updated expiresAt for email
      const updatedItems = await prisma.orderItem.findMany({ where: { orderId: order.id } });

      if (order.user?.email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails
          .send({
            from: FROM_EMAIL,
            to: order.user.email,
            subject: 'Confirmare comandă — ApexFit',
            html: buildConfirmationEmail(order.user.name, updatedItems, order.totalRon),
          })
          .catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}
