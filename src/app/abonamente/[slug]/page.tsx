import React from 'react';
import type { Metadata } from 'next';
import { StaticImageData } from 'next/image';
import './subscriptionCatCards.scss';
import { ICart } from '@/types/subscription';
import { prisma } from '@/lib/prisma';
import SubscriptionCardGrouped from '@/components/abonamente/subscriptionCard/SubscriptionCardGrouped';
import Trainers from '@/components/abonamente/trainers/Trainers';
import fitnessCard from '../../../../public/cardsImages/fitnessCards.jpg';
import zumbaCard from '../../../../public/cardsImages/zumbaCard.jpg';
import aerobicCard from '../../../../public/cardsImages/aerobic.jpg';
import cyclingCard from '../../../../public/cardsImages/cycling3.jpg';

const categoryImages: Record<string, StaticImageData> = {
  fitness: fitnessCard,
  zumba:   zumbaCard,
  aerobic: aerobicCard,
  cycling: cyclingCard,
};

interface IParams {
  slug: string;
}

function sectionLabel(slug: string, planType: 'entries' | 'monthly'): string {
  if (slug === 'fitness') {
    return planType === 'entries' ? 'Cu antrenor' : 'Fără antrenor';
  }
  return planType === 'entries' ? 'Pe intrări' : 'Pe luni';
}

export async function generateStaticParams() {
  const categories = await prisma.subscriptionCategory.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: IParams }): Promise<Metadata> {
  const category = await prisma.subscriptionCategory.findUnique({
    where: { slug: params.slug },
  });
  const name = category?.name ?? params.slug;
  const display = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    title: `Abonamente ${display} | ApexFit`,
    description: `Planuri și prețuri pentru ${name} la ApexFit. Alege abonamentul potrivit — pe intrări sau lunar.`,
  };
}

export default async function page({ params }: { params: IParams }) {
  const dbPlans = await prisma.subscriptionPlan.findMany({
    where: {
      category: { slug: params.slug },
      isActive: true,
    },
    orderBy: { sortOrder: 'asc' },
  });

  const plans: ICart[] = dbPlans.map((p) => ({
    id:            p.id,
    category:      params.slug,
    planType:      p.planType === 'MONTHLY' ? 'monthly' : 'entries',
    pass:          p.entries ?? undefined,
    durationMonths: p.durationMonths ?? undefined,
    withTrainer:   p.withTrainer ?? undefined,
    price:         Number(p.priceRon),
    description:   p.name,
  }));

  const entriesPlans = plans.filter((p) => p.planType === 'entries');
  const monthlyPlans = plans.filter((p) => p.planType === 'monthly');

  const imageCard: StaticImageData = categoryImages[params.slug] ?? zumbaCard;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Abonamente ${params.slug}`,
    itemListElement: plans.map((plan, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: plan.description || (
          plan.planType === 'entries'
            ? `Abonament ${plan.category} – ${plan.pass} ${(plan.pass ?? 0) < 2 ? 'ședință' : 'ședințe'}`
            : `Abonament ${plan.category} – ${plan.durationMonths} ${plan.durationMonths === 1 ? 'lună' : 'luni'}`
        ),
        offers: {
          '@type': 'Offer',
          price: plan.price,
          priceCurrency: 'RON',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <div className="subscription-slug-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grouped-cards-container">
        {entriesPlans.length > 0 && (
          <SubscriptionCardGrouped
            plans={entriesPlans}
            imageCard={imageCard}
            label={sectionLabel(params.slug, 'entries')}
          />
        )}
        {monthlyPlans.length > 0 && (
          <SubscriptionCardGrouped
            plans={monthlyPlans}
            imageCard={imageCard}
            label={sectionLabel(params.slug, 'monthly')}
            featured
          />
        )}
      </div>

      <Trainers slug={params.slug} />
    </div>
  );
}
