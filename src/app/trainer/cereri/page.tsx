import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TrainerRequestsTable from "@/components/trainer/TrainerRequestsTable";
import { IPersonalRequestWithDetails } from "@/types/booking";
import "@/components/trainer/trainer.scss";

export default async function TrainerCereriPage() {
  const session = await auth();
  const trainer = await prisma.trainer.findUnique({ where: { userId: session!.user.id } });

  if (!trainer) redirect("/trainer?no-profile=1");

  const requests = await prisma.personalRequest.findMany({
    where: { trainerId: trainer.id },
    orderBy: { createdAt: "desc" },
    include: {
      member: { select: { id: true, name: true, email: true, image: true } },
      trainer: { select: { id: true, name: true } },
    },
  });

  return (
    <div className="td-wrapper">
      <div className="td-top">
        <h1 className="td-page-title">Cereri personale</h1>
      </div>
      <TrainerRequestsTable requests={requests as IPersonalRequestWithDetails[]} />
    </div>
  );
}
