"use client";

import { useState } from "react";
import Link from "next/link";
import { IClassSessionWithDetails } from "@/types/booking";
import "./sesiuni.scss";

const CATEGORY_LABELS: Record<string, string> = {
  zumba: "Zumba",
  aerobic: "Aerobic",
  cycling: "Cycling",
  fitness: "Fitness",
};

const DAY_LABELS = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatWeekRange(start: Date): string {
  const end = addDays(start, 6);
  const startStr = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short" }).format(start);
  const endStr = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short", year: "numeric" }).format(end);
  return `${startStr} – ${endStr}`;
}

export default function SesiuniCalendar({ sessions }: { sessions: IClassSessionWithDetails[] }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPrevDisabled = weekStart <= today;

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekSessions = sessions.filter((s) => {
    const d = new Date(s.startAt);
    return d >= weekStart && d < addDays(weekStart, 7);
  });

  const hasAnySessions = weekSessions.length > 0;

  return (
    <div className="cal-container">
      <div className="cal-nav">
        <button
          className="cal-nav-btn"
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          disabled={isPrevDisabled}
        >
          ← Anterioară
        </button>
        <span className="cal-nav-label">{formatWeekRange(weekStart)}</span>
        <button
          className="cal-nav-btn"
          onClick={() => setWeekStart(addDays(weekStart, 7))}
        >
          Următoare →
        </button>
      </div>

      <div className="cal-week-grid">
        {weekDays.map((day, i) => {
          const daySessions = weekSessions
            .filter((s) => isSameDay(new Date(s.startAt), day))
            .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

          const isToday = isSameDay(day, new Date());
          const isPast = day < today;

          return (
            <div key={i} className={`cal-col${isToday ? " cal-col--today" : ""}${isPast ? " cal-col--past" : ""}`}>
              <div className="cal-col-header">
                <span className="cal-col-day">{DAY_LABELS[i]}</span>
                <span className="cal-col-date">{day.getDate()}</span>
              </div>

              <div className="cal-col-body">
                {daySessions.length === 0 ? (
                  <span className="cal-col-empty">—</span>
                ) : (
                  daySessions.map((s) => {
                    const spotsLeft = s.maxCapacity - s._count.bookings;
                    const isFull = spotsLeft <= 0;
                    const isCancelled = s.status === "CANCELLED";

                    return (
                      <Link
                        key={s.id}
                        href={`/sesiuni/${s.id}`}
                        className={`cal-event${isFull ? " cal-event--full" : ""}${isCancelled ? " cal-event--cancelled" : ""}`}
                      >
                        <span className="cal-event-time">{formatTime(s.startAt)}</span>
                        <span className="cal-event-cat">
                          {CATEGORY_LABELS[s.categorySlug] ?? s.categorySlug}
                        </span>
                        <span className="cal-event-trainer">{s.trainer.name}</span>
                        <span className={`cal-event-spots${isFull ? " cal-event-spots--full" : ""}`}>
                          {isCancelled ? "Anulat" : isFull ? "Complet" : `${spotsLeft} loc${spotsLeft === 1 ? "" : "uri"}`}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!hasAnySessions && (
        <p className="sn-empty">Nu există sesiuni programate în această săptămână.</p>
      )}
    </div>
  );
}
