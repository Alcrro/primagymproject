import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cancelBookingAction } from "@/app/actions/session";
import { cancelPersonalRequestAction } from "@/app/actions/personalRequest";
import styles from "./rezervari.module.scss";
import "./rezervari.scss";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "În așteptare", ACCEPTED: "Acceptat", REJECTED: "Refuzat",
  CANCELLED: "Anulat", CONFIRMED: "Confirmat",
};

function fmt(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

export default async function RezervariPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [bookings, requests] = await Promise.all([
    prisma.classBooking.findMany({
      where: { userId },
      orderBy: { session: { startAt: "desc" } },
      include: {
        session: {
          include: {
            trainer: { select: { name: true } },
            location: { select: { name: true, slug: true } },
          },
        },
      },
    }),
    prisma.personalRequest.findMany({
      where: { memberId: userId },
      orderBy: { createdAt: "desc" },
      include: { trainer: { select: { id: true, name: true, locationId: true } } },
    }),
  ]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Rezervările mele</h1>

      <section className="rz-section">
        <h2 className="rz-section-title">Sesiuni de grupă</h2>
        {bookings.length === 0 ? (
          <p className="rz-empty">Nu ai rezervări la sesiuni de grupă. <Link href="/sesiuni" className="rz-link">Vezi sesiunile disponibile →</Link></p>
        ) : (
          <ul className="rz-list">
            {bookings.map((b) => (
              <li key={b.id} className={`rz-item${b.status === "CANCELLED" ? " rz-item--cancelled" : ""}`}>
                <div className="rz-item-info">
                  <span className="rz-item-category">{b.session.categorySlug}</span>
                  <span className="rz-item-date">{fmt(b.session.startAt)}</span>
                  <span className="rz-item-trainer">{b.session.trainer.name}</span>
                  {b.session.location && <span className="rz-item-location">{b.session.location.name}</span>}
                </div>
                <div className="rz-item-right">
                  <span className={`rz-status rz-status--${b.status.toLowerCase()}`}>
                    {b.session.status === "CANCELLED" ? "Sesiune anulată" : STATUS_LABELS[b.status]}
                  </span>
                  {b.status === "CONFIRMED" && b.session.status === "SCHEDULED" && (
                    <form action={cancelBookingAction.bind(null, b.sessionId)}>
                      <button type="submit" className="rz-btn-cancel">Anulează</button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rz-section">
        <h2 className="rz-section-title">Cereri personale</h2>
        {requests.length === 0 ? (
          <p className="rz-empty">Nu ai trimis cereri personale. <Link href="/antrenori" className="rz-link">Descoperă antrenorii →</Link></p>
        ) : (
          <ul className="rz-list">
            {requests.map((r) => (
              <li key={r.id} className={`rz-item${r.status === "CANCELLED" || r.status === "REJECTED" ? " rz-item--cancelled" : ""}`}>
                <div className="rz-item-info">
                  <span className="rz-item-trainer">{r.trainer.name}</span>
                  <span className="rz-item-date">Solicitată: {fmt(r.requestedAt)}</span>
                  {r.message && <span className="rz-item-message">{r.message}</span>}
                </div>
                <div className="rz-item-right">
                  <span className={`rz-status rz-status--${r.status.toLowerCase()}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                  {r.status === "PENDING" && (
                    <form action={cancelPersonalRequestAction.bind(null, r.id)}>
                      <button type="submit" className="rz-btn-cancel">Anulează</button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
