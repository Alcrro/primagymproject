import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const trainers = await prisma.trainer.findMany({ where: { isActive: true }, include: { location: true } });
  const locations = await prisma.location.findMany({ where: { isActive: true } });

  if (trainers.length === 0) {
    console.log('No active trainers found. Add trainers first.');
    return;
  }

  const t = trainers[0];
  const locationId = t.locationId ?? locations[0]?.id ?? null;

  const now = new Date();

  const sessions = [
    {
      trainerId: t.id,
      locationId,
      categorySlug: 'fitness',
      startAt: addDays(now, 1, 9, 0),
      durationMinutes: 60,
      maxCapacity: 15,
      notes: 'Circuit training complet — toate grupele musculare',
    },
    {
      trainerId: t.id,
      locationId,
      categorySlug: 'zumba',
      startAt: addDays(now, 1, 18, 30),
      durationMinutes: 55,
      maxCapacity: 20,
      notes: 'Zumba cardio — nivel mediu',
    },
    {
      trainerId: t.id,
      locationId,
      categorySlug: 'cycling',
      startAt: addDays(now, 2, 7, 0),
      durationMinutes: 45,
      maxCapacity: 12,
      notes: 'Indoor cycling dimineața — ritm ridicat',
    },
    {
      trainerId: t.id,
      locationId,
      categorySlug: 'aerobic',
      startAt: addDays(now, 2, 17, 0),
      durationMinutes: 50,
      maxCapacity: 18,
      notes: null,
    },
    {
      trainerId: t.id,
      locationId,
      categorySlug: 'fitness',
      startAt: addDays(now, 3, 10, 0),
      durationMinutes: 90,
      maxCapacity: 10,
      notes: 'Antrenament forță + mobilitate',
    },
    {
      trainerId: t.id,
      locationId,
      categorySlug: 'zumba',
      startAt: addDays(now, 4, 19, 0),
      durationMinutes: 55,
      maxCapacity: 20,
      notes: null,
    },
    {
      trainerId: t.id,
      locationId,
      categorySlug: 'cycling',
      startAt: addDays(now, 5, 8, 0),
      durationMinutes: 45,
      maxCapacity: 12,
      notes: 'Sesiune de weekend — începători bine veniți',
    },
  ];

  // Use a second trainer if available
  if (trainers.length >= 2) {
    const t2 = trainers[1];
    sessions.push(
      {
        trainerId: t2.id,
        locationId: t2.locationId ?? locationId,
        categorySlug: 'fitness',
        startAt: addDays(now, 1, 11, 0),
        durationMinutes: 60,
        maxCapacity: 15,
        notes: 'Fitness cu ' + t2.name,
      },
      {
        trainerId: t2.id,
        locationId: t2.locationId ?? locationId,
        categorySlug: 'aerobic',
        startAt: addDays(now, 3, 16, 0),
        durationMinutes: 50,
        maxCapacity: 20,
        notes: null,
      },
    );
  }

  for (const s of sessions) {
    await prisma.classSession.create({ data: s });
    console.log(`Created: ${s.categorySlug} on ${s.startAt.toLocaleString('ro-RO')}`);
  }

  console.log(`\nDone — ${sessions.length} sessions created.`);
}

function addDays(base: Date, days: number, hour: number, minute: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

main().catch(console.error).finally(() => prisma.$disconnect());
