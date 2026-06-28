import { prisma } from '@/lib/prisma';
import TrainerCard from './TrainerCard';
import './trainers.scss';

export default async function Trainers({ slug }: { slug: string }) {
  const trainers = await prisma.trainer.findMany({
    where: {
      isActive: true,
      ...(slug ? { category: slug } : {}),
    },
    orderBy: { sortOrder: 'asc' },
    include: {
      reviews: { select: { rating: true } },
    },
  });

  const title = slug === '' ? 'Antrenori' : `Antrenori ${slug}`;

  return (
    <section className="trainers-section py-5">
      <h2 className="trainers-title">{title}</h2>
      <ul className={`trainers-grid${trainers.length < 2 ? ' single' : ''}`}>
        {trainers.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </ul>
    </section>
  );
}
