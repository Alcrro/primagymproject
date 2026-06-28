import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type PlanTypeValue = 'ENTRIES' | 'MONTHLY';

interface IPlanSeed {
  categorySlug: string;
  name: string;
  planType: PlanTypeValue;
  entries?: number;
  durationMonths?: number;
  withTrainer?: boolean;
  priceRon: number;
  sortOrder: number;
}

async function main() {
  // ─── Subscription Categories ───────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.subscriptionCategory.upsert({
      where: { slug: 'zumba' },
      update: { imageUrl: '/cardsImages/zumbaCard.jpg' },
      create: { slug: 'zumba', name: 'Zumba', imageUrl: '/cardsImages/zumbaCard.jpg', sortOrder: 0 },
    }),
    prisma.subscriptionCategory.upsert({
      where: { slug: 'aerobic' },
      update: { imageUrl: '/cardsImages/aerobic.jpg' },
      create: { slug: 'aerobic', name: 'Aerobic', imageUrl: '/cardsImages/aerobic.jpg', sortOrder: 1 },
    }),
    prisma.subscriptionCategory.upsert({
      where: { slug: 'cycling' },
      update: { imageUrl: '/cardsImages/cycling3.jpg' },
      create: { slug: 'cycling', name: 'Cycling', imageUrl: '/cardsImages/cycling3.jpg', sortOrder: 2 },
    }),
    prisma.subscriptionCategory.upsert({
      where: { slug: 'fitness' },
      update: { imageUrl: '/cardsImages/fitnessCards.jpg' },
      create: { slug: 'fitness', name: 'Fitness', imageUrl: '/cardsImages/fitnessCards.jpg', sortOrder: 3 },
    }),
  ]);

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // ─── Subscription Plans ────────────────────────────────────────────────────
  const plans: IPlanSeed[] = [
    // Zumba — intrări
    { categorySlug: 'zumba', name: '1 intrare / lună',  planType: 'ENTRIES', entries: 1,  priceRon: 30,  sortOrder: 0 },
    { categorySlug: 'zumba', name: '4 intrări / lună',  planType: 'ENTRIES', entries: 4,  priceRon: 100, sortOrder: 1 },
    { categorySlug: 'zumba', name: '8 intrări / lună',  planType: 'ENTRIES', entries: 8,  priceRon: 150, sortOrder: 2 },
    { categorySlug: 'zumba', name: '10 intrări / lună', planType: 'ENTRIES', entries: 10, priceRon: 175, sortOrder: 3 },

    // Zumba — luni
    { categorySlug: 'zumba', name: '1 lună',   planType: 'MONTHLY', durationMonths: 1,  priceRon: 150,  sortOrder: 10 },
    { categorySlug: 'zumba', name: '3 luni',   planType: 'MONTHLY', durationMonths: 3,  priceRon: 400,  sortOrder: 11 },
    { categorySlug: 'zumba', name: '6 luni',   planType: 'MONTHLY', durationMonths: 6,  priceRon: 750,  sortOrder: 12 },
    { categorySlug: 'zumba', name: '12 luni',  planType: 'MONTHLY', durationMonths: 12, priceRon: 1400, sortOrder: 13 },

    // Aerobic — intrări
    { categorySlug: 'aerobic', name: '1 intrare / lună',  planType: 'ENTRIES', entries: 1,  priceRon: 30,  sortOrder: 0 },
    { categorySlug: 'aerobic', name: '4 intrări / lună',  planType: 'ENTRIES', entries: 4,  priceRon: 100, sortOrder: 1 },
    { categorySlug: 'aerobic', name: '8 intrări / lună',  planType: 'ENTRIES', entries: 8,  priceRon: 150, sortOrder: 2 },
    { categorySlug: 'aerobic', name: '10 intrări / lună', planType: 'ENTRIES', entries: 10, priceRon: 175, sortOrder: 3 },

    // Aerobic — luni
    { categorySlug: 'aerobic', name: '1 lună',  planType: 'MONTHLY', durationMonths: 1,  priceRon: 150,  sortOrder: 10 },
    { categorySlug: 'aerobic', name: '3 luni',  planType: 'MONTHLY', durationMonths: 3,  priceRon: 400,  sortOrder: 11 },
    { categorySlug: 'aerobic', name: '6 luni',  planType: 'MONTHLY', durationMonths: 6,  priceRon: 750,  sortOrder: 12 },
    { categorySlug: 'aerobic', name: '12 luni', planType: 'MONTHLY', durationMonths: 12, priceRon: 1400, sortOrder: 13 },

    // Cycling — intrări
    { categorySlug: 'cycling', name: '1 intrare / lună',  planType: 'ENTRIES', entries: 1,  priceRon: 30,  sortOrder: 0 },
    { categorySlug: 'cycling', name: '4 intrări / lună',  planType: 'ENTRIES', entries: 4,  priceRon: 100, sortOrder: 1 },
    { categorySlug: 'cycling', name: '8 intrări / lună',  planType: 'ENTRIES', entries: 8,  priceRon: 150, sortOrder: 2 },
    { categorySlug: 'cycling', name: '10 intrări / lună', planType: 'ENTRIES', entries: 10, priceRon: 175, sortOrder: 3 },

    // Cycling — luni
    { categorySlug: 'cycling', name: '1 lună',  planType: 'MONTHLY', durationMonths: 1,  priceRon: 150,  sortOrder: 10 },
    { categorySlug: 'cycling', name: '3 luni',  planType: 'MONTHLY', durationMonths: 3,  priceRon: 400,  sortOrder: 11 },
    { categorySlug: 'cycling', name: '6 luni',  planType: 'MONTHLY', durationMonths: 6,  priceRon: 750,  sortOrder: 12 },
    { categorySlug: 'cycling', name: '12 luni', planType: 'MONTHLY', durationMonths: 12, priceRon: 1400, sortOrder: 13 },

    // Fitness — cu antrenor (intrări)
    { categorySlug: 'fitness', name: '1 intrare / lună',                  planType: 'ENTRIES', entries: 1,  withTrainer: true, priceRon: 30,  sortOrder: 0 },
    { categorySlug: 'fitness', name: '1 intrare / lună (Student)',         planType: 'ENTRIES', entries: 1,  withTrainer: true, priceRon: 20,  sortOrder: 1 },
    { categorySlug: 'fitness', name: '1 intrare / lună (Student Vacanță)', planType: 'ENTRIES', entries: 1,  withTrainer: true, priceRon: 50,  sortOrder: 2 },
    { categorySlug: 'fitness', name: '4 intrări / lună',                  planType: 'ENTRIES', entries: 4,  withTrainer: true, priceRon: 100, sortOrder: 3 },
    { categorySlug: 'fitness', name: '8 intrări / lună',                  planType: 'ENTRIES', entries: 8,  withTrainer: true, priceRon: 150, sortOrder: 4 },
    { categorySlug: 'fitness', name: '10 intrări / lună',                 planType: 'ENTRIES', entries: 10, withTrainer: true, priceRon: 175, sortOrder: 5 },

    // Fitness — fără antrenor (luni)
    { categorySlug: 'fitness', name: '1 lună',  planType: 'MONTHLY', durationMonths: 1,  withTrainer: false, priceRon: 120,  sortOrder: 10 },
    { categorySlug: 'fitness', name: '3 luni',  planType: 'MONTHLY', durationMonths: 3,  withTrainer: false, priceRon: 320,  sortOrder: 11 },
    { categorySlug: 'fitness', name: '6 luni',  planType: 'MONTHLY', durationMonths: 6,  withTrainer: false, priceRon: 600,  sortOrder: 12 },
    { categorySlug: 'fitness', name: '12 luni', planType: 'MONTHLY', durationMonths: 12, withTrainer: false, priceRon: 1100, sortOrder: 13 },
  ];

  await prisma.subscriptionPlan.deleteMany({});
  for (const plan of plans) {
    await prisma.subscriptionPlan.create({
      data: {
        categoryId:     bySlug[plan.categorySlug],
        name:           plan.name,
        planType:       plan.planType as Parameters<typeof prisma.subscriptionPlan.create>[0]['data']['planType'],
        entries:        plan.entries,
        durationMonths: plan.durationMonths,
        withTrainer:    plan.withTrainer,
        priceRon:       plan.priceRon,
        discountPct:    0,
        sortOrder:      plan.sortOrder,
      },
    });
  }

  // ─── Trainers ──────────────────────────────────────────────────────────────
  const trainers = [
    { name: 'alex',      age: 29, category: 'nimic',   thumbnail: 'eu', description: 'The best trainer' },
    { name: 'alexandra', age: 22, category: 'zumba',   thumbnail: '',   description: 'The best trainer' },
    { name: 'andreea',   age: 24, category: 'cycling', thumbnail: '',   description: 'The best trainer' },
    { name: 'malina',    age: 32, category: 'zumba',   thumbnail: '',   description: 'The best trainer' },
    { name: 'dom',       age: 42, category: 'fitness', thumbnail: '',   description: 'The best trainer' },
  ];

  await prisma.trainer.deleteMany({});
  for (let i = 0; i < trainers.length; i++) {
    await prisma.trainer.create({ data: { ...trainers[i], sortOrder: i } });
  }

  // ─── Gallery Photos ────────────────────────────────────────────────────────
  const photos = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'];

  await prisma.galleryPhoto.deleteMany({});
  for (let i = 0; i < photos.length; i++) {
    await prisma.galleryPhoto.create({
      data: {
        filename:  photos[i],
        url:       `/gallery/${photos[i]}`,
        altText:   `PrimaGym foto ${i + 1}`,
        sortOrder: i,
      },
    });
  }

  console.log('Seed complet.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
