import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import "./trainerDashboard.scss";

export default async function TrainerDashboardPage() {
  const session = await auth();
  const trainer = await prisma.trainer.findUnique({ where: { userId: session!.user.id } });

  if (!trainer) {
    return (
      <div className="tdb-wrapper">
        <h1 className="tdb-title">Dashboard Trainer</h1>
        <p className="tdb-no-profile">
          Contul tău nu este asociat cu un profil de antrenor.
          Contactează administratorul pentru a-ți linka profilul.
        </p>
      </div>
    );
  }

  const now = new Date();

  const [upcomingSessions, pendingRequests] = await Promise.all([
    prisma.classSession.count({
      where: { trainerId: trainer.id, status: "SCHEDULED", startAt: { gte: now } },
    }),
    prisma.personalRequest.count({
      where: { trainerId: trainer.id, status: "PENDING" },
    }),
  ]);

  return (
    <div className="tdb-wrapper">
      <h1 className="tdb-title">Bun venit, {trainer.name}</h1>
      <p className="tdb-subtitle">Dashboard antrenor</p>

      <div className="tdb-stats">
        <div className="tdb-stat">
          <span className="tdb-stat-value">{upcomingSessions}</span>
          <span className="tdb-stat-label">Sesiuni viitoare</span>
        </div>
        <div className="tdb-stat">
          <span className="tdb-stat-value">{pendingRequests}</span>
          <span className="tdb-stat-label">Cereri în așteptare</span>
        </div>
      </div>

      <div className="tdb-actions">
        <Link href="/trainer/sesiuni" className="tdb-action-card">
          <span className="tdb-action-icon">📅</span>
          <span>Sesiunile mele</span>
        </Link>
        <Link href="/trainer/cereri" className="tdb-action-card">
          <span className="tdb-action-icon">📩</span>
          <span>Cereri personale</span>
          {pendingRequests > 0 && <span className="tdb-badge">{pendingRequests}</span>}
        </Link>
      </div>
    </div>
  );
}
