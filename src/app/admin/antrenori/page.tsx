import { prisma } from "@/lib/prisma";
import AdminTrainersPage from "@/components/admin/antrenori/AdminTrainersPage";
import { ITrainerWithLocation } from "@/types/trainer";
import { ILocation } from "@/types/location";

export default async function AdminAntrenoriPage() {
  const [trainers, locations] = await Promise.all([
    prisma.trainer.findMany({
      orderBy: [{ locationId: "asc" }, { sortOrder: "asc" }],
      include: {
        location: { select: { id: true, slug: true, name: true } },
      },
    }),
    prisma.location.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <AdminTrainersPage
      trainers={trainers as ITrainerWithLocation[]}
      locations={locations as ILocation[]}
    />
  );
}
