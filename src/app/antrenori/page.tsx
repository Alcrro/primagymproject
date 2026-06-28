import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import TrainersList from "@/components/antrenori/TrainersList";
import "./antrenori.scss";

export const metadata: Metadata = {
  title: "Antrenori",
  description:
    "Cunoaște echipa de antrenori ApexFit din Bacău — instructori certificați în fitness, zumba, aerobic și cycling cu experiență și pasiune pentru sport.",
};

export default async function AntrenoriPage() {
  const locations = await prisma.location.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      trainers: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { reviews: { select: { rating: true } } },
      },
    },
  });

  return (
    <div className="an-container">
      {locations.length === 0 && (
        <p className="an-empty">Nu există locații disponibile momentan.</p>
      )}

      {locations.map((loc) => (
        <section key={loc.id} className="an-section">
          <div className="an-section-header">
            <h2 className="an-location-title">{loc.name}</h2>
            {loc.address && <span className="an-address">{loc.address}</span>}
          </div>
          <TrainersList trainers={loc.trainers} locationSlug={loc.slug} />
        </section>
      ))}
    </div>
  );
}
