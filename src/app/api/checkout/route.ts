import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { ICart } from '@/types/subscription';

function planLabel(item: ICart): string {
  const cat = item.category.charAt(0).toUpperCase() + item.category.slice(1);
  if (item.planType === 'entries') {
    return `${cat} — ${item.pass} ${item.pass === 1 ? 'intrare' : 'intrări'}`;
  }
  return `${cat} — ${item.durationMonths} ${item.durationMonths === 1 ? 'lună' : 'luni'}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });
  }

  const body: { items: ICart[]; discountCode?: string } = await req.json();
  const items = body.items;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Coșul este gol' }, { status: 400 });
  }

  const totalRon = items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  const stripeSession = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item) => ({
      price_data: {
        currency: 'ron',
        product_data: { name: planLabel(item) },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity ?? 1,
    })),
    mode: 'payment',
    success_url: `${baseUrl}/cos/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cos`,
  });

  await prisma.order.create({
    data: {
      userId: session.user.id,
      totalRon,
      paymentMethod: 'stripe',
      paymentRef: stripeSession.id,
      items: {
        create: items.map((item) => ({
          planName: planLabel(item),
          categoryName: item.category,
          quantity: item.quantity ?? 1,
          priceRon: item.price,
          totalEntries: item.planType === 'entries' ? (item.pass ?? 1) * (item.quantity ?? 1) : null,
          expiresAt: item.planType === 'monthly'
            ? new Date(Date.now() + (item.durationMonths ?? 1) * 30 * 24 * 60 * 60 * 1000)
            : null,
        })),
      },
    },
  });

  return NextResponse.json({ url: stripeSession.url });
}
