import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TrainerSesiuniClient from "@/components/trainer/TrainerSesiuniClient";
import { IClassSession } from "@/types/booking";
import { ILocation } from "@/types/location";

export default async function TrainerSesiuniPage() {
  const session = await auth();
  const trainer = await prisma.trainer.findUnique({ where: { userId: session!.user.id } });

  if (!trainer) {
    redirect("/trainer?no-profile=1");
  }

  const [sessions, locations] = await Promise.all([
    prisma.classSession.findMany({
      where: { trainerId: trainer.id },
      orderBy: { startAt: "desc" },
    }),
    prisma.location.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <TrainerSesiuniClient
      sessions={sessions as IClassSession[]}
      locations={locations as ILocation[]}
    />
  );
}
