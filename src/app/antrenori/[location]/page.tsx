import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrainersList from "@/components/antrenori/TrainersList";
import "./antrenoriLocation.scss";

interface IPageProps {
  params: { location: string };
}

export default async function AntrenoriLocationPage({ params }: IPageProps) {
  const location = await prisma.location.findUnique({
    where: { slug: params.location, isActive: true },
  });

  if (!location) notFound();

  const trainers = await prisma.trainer.findMany({
    where: { locationId: location.id, isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { reviews: { select: { rating: true } } },
  });

  return (
    <div className="al-container">
      <header className="al-header">
        <h1 className="al-title">{location.name}</h1>
        {location.address && <p className="al-address">{location.address}</p>}
      </header>

      <TrainersList trainers={trainers} locationSlug={params.location} />
    </div>
  );
}
