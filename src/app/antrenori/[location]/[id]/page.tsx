import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrainerDetail from "@/components/antrenori/TrainerDetail";
import { ITrainerWithLocation } from "@/types/trainer";

interface IPageProps {
  params: { location: string; id: string };
}

export default async function TrainerDetailPage({ params }: IPageProps) {
  const trainer = await prisma.trainer.findFirst({
    where: {
      id: parseInt(params.id, 10),
      isActive: true,
      location: { slug: params.location },
    },
    include: {
      location: { select: { id: true, slug: true, name: true } },
    },
  });

  if (!trainer) notFound();

  return <TrainerDetail trainer={trainer as ITrainerWithLocation} />;
}
