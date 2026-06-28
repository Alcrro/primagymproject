import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SessionCard from "@/components/sesiuni/SessionCard";
import SesiuniCalendar from "@/components/sesiuni/SesiuniCalendar";
import SesiuniFilter from "@/components/sesiuni/SesiuniFilter";
import { IClassSessionWithDetails } from "@/types/booking";
import "./sesiuni.scss";

export const metadata: Metadata = {
  title: "Sesiuni",
  description:
    "Vezi toate sesiunile disponibile la ApexFit Bacău — zumba, fitness, aerobic, cycling. Filtrează după categorie și rezervă-ți locul online.",
};

const CATEGORY_LABELS: Record<string, string> = {
  zumba: "Zumba", aerobic: "Aerobic", cycling: "Cycling", fitness: "Fitness",
};

interface ISearchParams { categorie?: string; view?: string }

export default async function SesiuniPage({ searchParams }: { searchParams: ISearchParams }) {
  const categorie = searchParams.categorie ?? "";
  const view = searchParams.view === "calendar" ? "calendar" : "grid";

  const sessions = await prisma.classSession.findMany({
    where: {
      status: "SCHEDULED",
      startAt: { gte: new Date() },
      ...(categorie ? { categorySlug: categorie } : {}),
    },
    orderBy: { startAt: "asc" },
    include: {
      trainer: { select: { id: true, name: true, thumbnail: true } },
      location: { select: { id: true, slug: true, name: true } },
      _count: { select: { bookings: { where: { status: "CONFIRMED" } } } },
    },
  });

  const emptyLabel = categorie
    ? `de ${CATEGORY_LABELS[categorie] ?? categorie} `
    : "";

  return (
    <div className="sn-container">
      <h1 className="sn-title">Sesiuni disponibile</h1>

      <Suspense>
        <SesiuniFilter />
      </Suspense>

      {sessions.length === 0 ? (
        <p className="sn-empty">Nu există sesiuni {emptyLabel}programate momentan.</p>
      ) : view === "calendar" ? (
        <SesiuniCalendar sessions={sessions as IClassSessionWithDetails[]} />
      ) : (
        <ul className="sl-grid">
          {sessions.map((s) => (
            <li key={s.id}>
              <SessionCard session={s as IClassSessionWithDetails} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
