import Link from "next/link";
import { IClassSessionWithDetails } from "@/types/booking";
import "./sesiuni.scss";

const CATEGORY_LABELS: Record<string, string> = {
  zumba: "Zumba",
  aerobic: "Aerobic",
  cycling: "Cycling",
  fitness: "Fitness",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "short", day: "numeric", month: "short",
  }).format(new Date(date));
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

interface ISessionCardProps {
  session: IClassSessionWithDetails;
}

export default function SessionCard({ session }: ISessionCardProps) {
  const spotsLeft = session.maxCapacity - session._count.bookings;
  const isFull = spotsLeft <= 0;
  const isCancelled = session.status === "CANCELLED";

  return (
    <Link href={`/sesiuni/${session.id}`} className={`sc-card${isCancelled ? " sc-card--cancelled" : ""}`}>
      <div className="sc-top">
        <span className="sc-category">{CATEGORY_LABELS[session.categorySlug] ?? session.categorySlug}</span>
        {isCancelled && <span className="sc-badge sc-badge--cancelled">Anulat</span>}
        {!isCancelled && isFull && <span className="sc-badge sc-badge--full">Complet</span>}
      </div>

      <div className="sc-time">
        <span className="sc-date">{formatDate(session.startAt)}</span>
        <span className="sc-hour">{formatTime(session.startAt)}</span>
        <span className="sc-duration">{session.durationMinutes} min</span>
      </div>

      <div className="sc-footer">
        <span className="sc-trainer">{session.trainer.name}</span>
        {session.location && <span className="sc-location">{session.location.name}</span>}
        {!isCancelled && (
          <span className={`sc-spots${isFull ? " sc-spots--full" : ""}`}>
            {isFull ? "Complet" : `${spotsLeft} locuri`}
          </span>
        )}
      </div>
    </Link>
  );
}
