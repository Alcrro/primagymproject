import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'alex.roventa94@gmail.com' },
    select: { id: true },
  });

  if (!user) { console.log('User not found'); return; }

  // Șterge comenzile existente de test
  await prisma.order.deleteMany({ where: { userId: user.id } });

  const now = new Date();
  const months = (n: number) => new Date(now.getTime() + n * 30 * 24 * 60 * 60 * 1000);

  // Crează comenzi cu câmpurile noi
  const o1 = await prisma.order.create({
    data: {
      userId: user.id, status: 'PAID', totalRon: 250, paymentMethod: 'stripe', paymentRef: 'cs_test_seed_1',
      items: { create: [
        { planName: 'Zumba — 4 intrări',   categoryName: 'zumba',   quantity: 1, priceRon: 100, totalEntries: 4,  expiresAt: null },
        { planName: 'Aerobic — 1 lună',    categoryName: 'aerobic', quantity: 1, priceRon: 150, totalEntries: null, expiresAt: months(1) },
      ]},
    },
  });

  const o2 = await prisma.order.create({
    data: {
      userId: user.id, status: 'PAID', totalRon: 150, paymentMethod: 'stripe', paymentRef: 'cs_test_seed_2',
      items: { create: [
        { planName: 'Fitness — 4 intrări', categoryName: 'fitness', quantity: 1, priceRon: 150, totalEntries: 4, expiresAt: null },
      ]},
    },
  });

  await prisma.order.create({
    data: {
      userId: user.id, status: 'PENDING', totalRon: 400, paymentMethod: 'stripe', paymentRef: 'cs_test_seed_3',
      items: { create: [
        { planName: 'Cycling — 3 luni', categoryName: 'cycling', quantity: 1, priceRon: 400, totalEntries: null, expiresAt: months(3) },
      ]},
    },
  });

  console.log(`Comenzi recreate: #${o1.id} (PAID), #${o2.id} (PAID), PENDING`);
}

main().finally(() => prisma.$disconnect());
