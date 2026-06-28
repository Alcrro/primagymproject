import { prisma } from "@/lib/prisma";
import AdminSesiuniPage from "@/components/admin/sesiuni/AdminSesiuniPage";
import { IClassSession, SessionStatus } from "@/types/booking";
import { ILocation } from "@/types/location";

type SessionWithDetails = IClassSession & {
  trainer: { id: number; name: string };
  location: { name: string } | null;
  _count: { bookings: number };
};

export default async function AdminSesiuniRoute() {
  const [rawSessions, rawTrainers, rawLocations] = await Promise.all([
    prisma.classSession.findMany({
      orderBy: { startAt: "desc" },
      include: {
        trainer: { select: { id: true, name: true } },
        location: { select: { name: true } },
        _count: { select: { bookings: true } },
      },
    }),
    prisma.trainer.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, category: true },
    }),
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const sessions = rawSessions.map((s) => ({
    ...s,
    status: s.status as SessionStatus,
  })) as SessionWithDetails[];

  return (
    <AdminSesiuniPage
      sessions={sessions}
      trainers={rawTrainers}
      locations={rawLocations as ILocation[]}
    />
  );
}
