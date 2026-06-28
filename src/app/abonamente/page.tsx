import React from 'react';
import type { Metadata } from 'next';
import './abonamente.scss';
import Subscriptions from '@/components/abonamente/abonamente/Subscriptions';
import Trainers from '@/components/abonamente/trainers/Trainers';
import Faq from '@/components/abonamente/faq/Faq';

export const metadata: Metadata = {
  title: 'Abonamente Sală',
  description:
    'Descoperă planurile de abonament la ApexFit: zumba, fitness, aerobic și cycling. Prețuri abonament lunar, trimestrial și ședințe individuale pentru sala din Bacău.',
};

export default function page() {
  return (
    <>
      <Subscriptions />
      <Trainers slug="" />
      <Faq />
    </>
  );
}
