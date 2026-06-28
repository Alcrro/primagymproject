"use client";

import { useState } from "react";
import { cancelSessionAction } from "@/app/actions/session";
import TrainerSessionForm from "./TrainerSessionForm";
import { IClassSession } from "@/types/booking";
import { ILocation } from "@/types/location";
import "./trainer.scss";

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Programat", CANCELLED: "Anulat", COMPLETED: "Finalizat",
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

interface ITrainerSesiuniClientProps {
  sessions: IClassSession[];
  locations: ILocation[];
}

export default function TrainerSesiuniClient({ sessions, locations }: ITrainerSesiuniClientProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IClassSession | null>(null);

  function openNew() { setEditing(null); setFormOpen(true); }
  function openEdit(s: IClassSession) { setEditing(s); setFormOpen(true); }

  return (
    <div className="td-wrapper">
      <div className="td-top">
        <h1 className="td-page-title">Sesiunile mele</h1>
        <button className="td-btn-primary" onClick={openNew}>+ Sesiune nouă</button>
      </div>

      <div className="ts-table-wrap">
        <table className="ts-table">
          <thead>
            <tr>
              <th>Categorie</th>
              <th>Data și ora</th>
              <th>Durată</th>
              <th>Locuri</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 && (
              <tr><td colSpan={6} className="ts-empty">Nu ai sesiuni înregistrate.</td></tr>
            )}
            {sessions.map((s) => (
              <tr key={s.id}>
                <td style={{ textTransform: "capitalize", fontWeight: 600 }}>{s.categorySlug}</td>
                <td>{formatDateTime(s.startAt)}</td>
                <td>{s.durationMinutes} min</td>
                <td>{s.maxCapacity} locuri</td>
                <td>
                  <span className={`ts-status ts-status--${s.status.toLowerCase()}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                </td>
                <td>
                  <div className="ts-row-actions">
                    {s.status === "SCHEDULED" && (
                      <>
                        <button className="ts-btn-edit" onClick={() => openEdit(s)}>Editează</button>
                        <form action={cancelSessionAction.bind(null, s.id)}
                          onSubmit={(e) => { if (!confirm("Anulezi sesiunea?")) e.preventDefault(); }}
                        >
                          <button type="submit" className="ts-btn-cancel-session">Anulează</button>
                        </form>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <TrainerSessionForm
          session={editing ?? undefined}
          locations={locations}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
