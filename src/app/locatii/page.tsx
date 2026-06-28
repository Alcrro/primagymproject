import { prisma } from "@/lib/prisma";
import LocationCard from "@/components/locatii/LocationCard";
import { ILocation } from "@/types/location";
import "@/components/locatii/locatii.scss";

export const metadata = {
  title: "Locații PrimaGYM",
  description: "Găsește sala PrimaGYM cea mai apropiată de tine. Vezi adresa, programul și facilitățile fiecărei locații.",
};

export default async function LocatiiPage() {
  const locations = await prisma.location.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { trainers: { where: { isActive: true } } } },
    },
  });

  return (
    <div className="loc-container">
      <h1 className="loc-title">Locațiile noastre</h1>
      <ul className="loc-grid">
        {locations.map((loc) => (
          <li key={loc.id}>
            <LocationCard location={loc as ILocation & { _count: { trainers: number } }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
