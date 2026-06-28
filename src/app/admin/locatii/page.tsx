import { prisma } from "@/lib/prisma";
import AdminLocatiiPage from "@/components/admin/locatii/AdminLocatiiPage";
import { ILocation } from "@/types/location";

type LocationWithCount = ILocation & { _count: { trainers: number } };

export default async function AdminLocatiiRoute() {
  const rawLocations = await prisma.location.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { trainers: true } },
    },
  });

  return (
    <AdminLocatiiPage locations={rawLocations as LocationWithCount[]} />
  );
}
