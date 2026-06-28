import React from "react";
import "./scheduleV2.scss";
import { schedules } from "@/app/_core/schedule";
import type { IScheduleEntry, IScheduleGroup } from "@/types/schedule";

function isActive(oraStart: string, oraEnd: string): boolean {
  const now = new Date();
  const [sh, sm] = oraStart.split(":").map(Number);
  const [eh, em] = oraEnd.split(":").map(Number);
  const start = new Date(now);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(now);
  end.setHours(eh, em, 0, 0);
  return now >= start && now <= end;
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export default function ScheduleV2() {
  const weekend = isWeekend();
  const today = new Date().toLocaleDateString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const group = (schedules as IScheduleGroup[]).find(
    (s) => s.category === "group"
  );
  const fitness = (schedules as IScheduleGroup[]).find(
    (s) => s.category === "fitness" && s.weekday !== "Saturday"
  );

  return (
    <section className="sv2-container">
      <div className="sv2-grid">
        {group && (
          <div className="sv2-card">
            <div className="sv2-card-header">
              <span className="sv2-label">Orar Grupe</span>
              <span className="sv2-date" suppressHydrationWarning>{today}</span>
            </div>
            <ul className="sv2-list">
              {group.values.map((item) => {
                const active = !weekend && isActive(item.oraStart, item.oraEnd);
                return (
                  <li key={item.id} className={`sv2-item${active ? " sv2-active" : ""}${weekend ? " sv2-closed" : ""}`}>
                    <span className="sv2-time">
                      {weekend ? (
                        <span className="sv2-closed-label">Închis</span>
                      ) : active ? (
                        <span className="sv2-now">Acum</span>
                      ) : (
                        `${item.oraStart} – ${item.oraEnd}`
                      )}
                    </span>
                    <span className="sv2-class">{item.category}</span>
                    {item.trainer && (
                      <span className="sv2-trainer">{item.trainer}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {fitness && (
          <div className="sv2-card">
            <div className="sv2-card-header">
              <span className="sv2-label">Orar Fitness</span>
              <span className="sv2-date" suppressHydrationWarning>{today}</span>
            </div>
            <ul className="sv2-list">
              {fitness.values.map((item) => {
                const active = !weekend && isActive(item.oraStart, item.oraEnd);
                return (
                  <li key={item.id} className={`sv2-item${active ? " sv2-active" : ""}${weekend ? " sv2-closed" : ""}`}>
                    <span className="sv2-time">
                      {weekend ? (
                        <span className="sv2-closed-label">Închis</span>
                      ) : active ? (
                        <span className="sv2-now">Acum</span>
                      ) : (
                        `${item.oraStart} – ${item.oraEnd}`
                      )}
                    </span>
                    <span className="sv2-class">{item.category}</span>
                    {item.trainer && (
                      <span className="sv2-trainer">{item.trainer}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
