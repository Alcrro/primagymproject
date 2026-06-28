"use client";

import { useState } from "react";
import { IClassSession, SessionStatus } from "@/types/booking";
import { ILocation } from "@/types/location";
import { cancelSessionAction } from "@/app/actions/session";
import AdminSessionForm from "./AdminSessionForm";
import "./adminSesiuni.scss";

type SessionWithDetails = IClassSession & {
  trainer: { id: number; name: string };
  location: { name: string } | null;
  _count: { bookings: number };
};

interface IAdminSesiuniPageProps {
  sessions: SessionWithDetails[];
  trainers: { id: number; name: string; category: string }[];
  locations: ILocation[];
}

const STATUS_LABELS: Record<SessionStatus, string> = {
  SCHEDULED: "Programată",
  CANCELLED: "Anulată",
  COMPLETED: "Finalizată",
};

const STATUS_CLASS: Record<SessionStatus, string> = {
  SCHEDULED: "scheduled",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export default function AdminSesiuniPage({ sessions, trainers, locations }: IAdminSesiuniPageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SessionWithDetails | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = sessions.filter((s) => {
    const matchCat = filterCategory === "all" || s.categorySlug === filterCategory;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchCat && matchStatus;
  });

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(session: SessionWithDetails) {
    setEditing(session);
    setFormOpen(true);
  }

  function formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <div className="as-wrapper">
      <div className="as-top">
        <h1 className="as-title">Sesiuni de grup</h1>
        <button className="as-btn-add" onClick={openAdd}>+ Sesiune nouă</button>
      </div>

      <div className="as-filters">
        <select
          className="as-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">Toate categoriile</option>
          <option value="zumba">Zumba</option>
          <option value="aerobic">Aerobic</option>
          <option value="cycling">Cycling</option>
          <option value="fitness">Fitness</option>
        </select>

        <select
          className="as-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Toate statusurile</option>
          <option value="SCHEDULED">Programate</option>
          <option value="CANCELLED">Anulate</option>
          <option value="COMPLETED">Finalizate</option>
        </select>
      </div>

      <div className="as-table-wrap">
        <table className="as-table">
          <thead>
            <tr>
              <th>Categorie</th>
              <th>Antrenor</th>
              <th>Data / Ora</th>
              <th>Durată</th>
              <th>Capacitate</th>
              <th>Rezervări</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="as-empty">Nu există sesiuni.</td>
              </tr>
            )}
            {filtered.map((session) => (
              <tr key={session.id}>
                <td className="as-category">{session.categorySlug}</td>
                <td>{session.trainer.name}</td>
                <td>{formatDateTime(session.startAt)}</td>
                <td>{session.durationMinutes} min</td>
                <td>{session.maxCapacity}</td>
                <td>{session._count.bookings}</td>
                <td>
                  <span className={`as-status ${STATUS_CLASS[session.status]}`}>
                    {STATUS_LABELS[session.status]}
                  </span>
                </td>
                <td>
                  <div className="as-row-actions">
                    {session.status === "SCHEDULED" && (
                      <>
                        <button className="as-btn-edit" onClick={() => openEdit(session)}>
                          Editează
                        </button>
                        <form
                          action={cancelSessionAction.bind(null, session.id)}
                          onSubmit={(e) => {
                            if (!confirm("Anulezi această sesiune?")) e.preventDefault();
                          }}
                        >
                          <button type="submit" className="as-btn-cancel">Anulează</button>
                        </form>
                      </>
                    )}
                    {session.status !== "SCHEDULED" && (
                      <span className="as-muted">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <AdminSessionForm
          session={editing ?? undefined}
          trainers={trainers}
          locations={locations}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
