import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import BookingButton from "@/components/sesiuni/BookingButton";
import Link from "next/link";
import { IClassSessionWithDetails } from "@/types/booking";
import "./sessionDetail.scss";

const CATEGORY_LABELS: Record<string, string> = {
  zumba: "Zumba", aerobic: "Aerobic", cycling: "Cycling", fitness: "Fitness",
};

function fmt(date: Date, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("ro-RO", opts).format(new Date(date));
}

interface IPageProps { params: { id: string } }

export default async function SessionDetailPage({ params }: IPageProps) {
  const [session, authSession] = await Promise.all([
    prisma.classSession.findUnique({
      where: { id: parseInt(params.id, 10) },
      include: {
        trainer: { select: { id: true, name: true, thumbnail: true } },
        location: { select: { id: true, slug: true, name: true } },
        _count: { select: { bookings: { where: { status: "CONFIRMED" } } } },
      },
    }),
    auth(),
  ]);

  if (!session) notFound();

  const userId = authSession?.user.id ?? null;
  const spotsLeft = session.maxCapacity - session._count.bookings;
  const isFull = spotsLeft <= 0;

  const hasBooking = userId
    ? !!(await prisma.classBooking.findUnique({
        where: { sessionId_userId: { sessionId: session.id, userId } },
        select: { status: true },
      }).then((b) => b?.status === "CONFIRMED"))
    : false;

  return (
    <div className="sd-container">
      <Link href="/sesiuni" className="sd-back">← Înapoi la sesiuni</Link>

      <div className="sd-hero">
        <span className="sd-category">{CATEGORY_LABELS[session.categorySlug] ?? session.categorySlug}</span>
        <h1 className="sd-title">
          {fmt(session.startAt, { weekday: "long", day: "numeric", month: "long" })}
        </h1>
        <p className="sd-time">
          {fmt(session.startAt, { hour: "2-digit", minute: "2-digit" })} · {session.durationMinutes} minute
        </p>
      </div>

      <div className="sd-meta">
        <div className="sd-meta-item">
          <span className="sd-meta-label">Antrenor</span>
          <Link href={session.trainer ? `/antrenori/${session.location?.slug ?? ""}/${session.trainer.id}` : "#"} className="sd-meta-value sd-trainer-link">
            {session.trainer.name}
          </Link>
        </div>
        {session.location && (
          <div className="sd-meta-item">
            <span className="sd-meta-label">Locație</span>
            <span className="sd-meta-value">{session.location.name}</span>
          </div>
        )}
        <div className="sd-meta-item">
          <span className="sd-meta-label">Locuri</span>
          <span className={`sd-meta-value${isFull ? " sd-full" : ""}`}>
            {session._count.bookings}/{session.maxCapacity}
          </span>
        </div>
      </div>

      {session.notes && <p className="sd-notes">{session.notes}</p>}

      <div className="sd-booking">
        <BookingButton
          sessionId={session.id}
          isFull={isFull}
          isCancelled={session.status === "CANCELLED"}
          isAuthenticated={!!userId}
          hasBooking={hasBooking}
          categorySlug={session.categorySlug}
        />
      </div>
    </div>
  );
}
